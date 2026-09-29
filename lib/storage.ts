import { db } from './db';
import { CertEvent, Recipient, DEFAULT_TEXT_CONFIG, DEFAULT_EMAIL_SUBJECT, DEFAULT_EMAIL_BODY } from './types';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from "uuid";
import {
  createRandomEventAvatarConfig,
  ensureEventAvatars,
  parseEventAvatarDataUri,
} from "@/lib/event-avatar";

const DATA_DIR = path.join(process.cwd(), 'data');
const ORGS_DIR = path.join(DATA_DIR, 'orgs');

export async function getAllEvents(orgId: string): Promise<CertEvent[]> {
  await ensureEventAvatars();
  const eventsRes = await db.execute({
    sql: `
      SELECT e.*, a.config AS avatarConfig
      FROM Event e
      JOIN EventAvatar a ON a.eventId = e.id
      WHERE e.orgId = ?
      ORDER BY e.createdAt DESC
    `,
    args: [orgId]
  });

  const allEvents = [];
  for (const row of eventsRes.rows) {
    const recRes = await db.execute({ sql: 'SELECT * FROM Recipient WHERE eventId = ?', args: [row.id as string] });
    
    allEvents.push({
      id: row.id as string,
      name: row.name as string,
      avatar: parseEventAvatarDataUri(row.avatarConfig),
      description: row.description as string,
      status: row.status as CertEvent['status'],
      emailSubject: row.emailSubject as string,
      emailBody: row.emailBody as string,
      hasTemplate: Boolean(row.hasTemplate),
      templateWidth: row.templateWidth as number | null,
      templateHeight: row.templateHeight as number | null,
      textConfig: JSON.parse(row.textConfig as string),
      createdAt: new Date(row.createdAt as string).toISOString(),
      recipients: recRes.rows.map(r => ({
        id: r.id as string,
        name: r.name as string,
        email: r.email as string,
        status: r.status as Recipient['status'],
        error: (r.error as string) || undefined,
      }))
    });
  }

  return allEvents;
}

export async function getEvent(id: string, orgId: string): Promise<CertEvent | null> {
  await ensureEventAvatars();
  const eRes = await db.execute({
    sql: `
      SELECT e.*, a.config AS avatarConfig
      FROM Event e
      JOIN EventAvatar a ON a.eventId = e.id
      WHERE e.id = ? AND e.orgId = ?
    `,
    args: [id, orgId],
  });
  if (eRes.rows.length === 0) return null;
  
  const row = eRes.rows[0];
  const recRes = await db.execute({ sql: 'SELECT * FROM Recipient WHERE eventId = ?', args: [id] });

  return {
    id: row.id as string,
    name: row.name as string,
    avatar: parseEventAvatarDataUri(row.avatarConfig),
    description: row.description as string,
    status: row.status as CertEvent['status'],
    emailSubject: row.emailSubject as string,
    emailBody: row.emailBody as string,
    hasTemplate: Boolean(row.hasTemplate),
    templateWidth: row.templateWidth as number | null,
    templateHeight: row.templateHeight as number | null,
    textConfig: JSON.parse(row.textConfig as string),
    createdAt: new Date(row.createdAt as string).toISOString(),
    recipients: recRes.rows.map(r => ({
      id: r.id as string,
      name: r.name as string,
      email: r.email as string,
      status: r.status as Recipient['status'],
      error: (r.error as string) || undefined,
    }))
  };
}

export async function createEvent(name: string, description: string, orgId: string): Promise<CertEvent> {
  const id = uuidv4();
  const textConfig = JSON.stringify(DEFAULT_TEXT_CONFIG);
  await ensureEventAvatars();
  const avatarConfig = JSON.stringify(createRandomEventAvatarConfig());
  
  await db.batch([
    {
      sql: `INSERT INTO Event (id, name, description, orgId, textConfig, emailSubject, emailBody, status, hasTemplate)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', 0)`,
      args: [id, name, description, orgId, textConfig, DEFAULT_EMAIL_SUBJECT, DEFAULT_EMAIL_BODY],
    },
    {
      sql: "INSERT INTO EventAvatar (eventId, config) VALUES (?, ?)",
      args: [id, avatarConfig],
    },
  ]);

  const actualDir = path.join(ORGS_DIR, orgId, 'events', id);
  await fs.mkdir(actualDir, { recursive: true });
  await fs.mkdir(path.join(actualDir, 'certificates'), { recursive: true });

  return (await getEvent(id, orgId))!;
}

export async function updateEvent(id: string, orgId: string, updates: Partial<CertEvent>): Promise<CertEvent | null> {
  if (updates.recipients) {
    await db.execute({ sql: 'DELETE FROM Recipient WHERE eventId = ?', args: [id] });
    if (updates.recipients.length > 0) {
      const stmts = updates.recipients.map(r => ({
        sql: 'INSERT INTO Recipient (id, name, email, status, error, eventId) VALUES (?, ?, ?, ?, ?, ?)',
        args: [uuidv4(), r.name, r.email, r.status, r.error || null, id]
      }));
      await db.batch(stmts);
    }
    delete updates.recipients;
  }

  const keys = Object.keys(updates);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const args = keys.map(k => {
      let val = (updates as any)[k];
      if (k === 'textConfig') val = JSON.stringify(val);
      if (k === 'hasTemplate') val = val ? 1 : 0;
      return val;
    });
    
    await db.execute({
      sql: `UPDATE Event SET ${setClause} WHERE id = ? AND orgId = ?`,
      args: [...args, id, orgId]
    });
  }

  return getEvent(id, orgId);
}

export async function deleteEvent(id: string, orgId: string): Promise<void> {
  await db.execute({ sql: 'DELETE FROM Event WHERE id = ? AND orgId = ?', args: [id, orgId] });
  const eventDir = path.join(ORGS_DIR, orgId, 'events', id);
  try {
    await fs.rm(eventDir, { recursive: true, force: true });
  } catch (err) {}
}

export async function getCertificatePath(id: string, orgId: string, index: number): Promise<string> {
  return path.join(ORGS_DIR, orgId, 'events', id, 'certificates', `${index}.pdf`);
}
