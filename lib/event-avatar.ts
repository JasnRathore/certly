import { db } from "@/lib/db";
import {
  createOrganizationAvatarDataUri,
  createRandomOrganizationAvatarConfig,
  parseOrganizationAvatarConfig,
  type OrganizationAvatarConfig,
} from "@/lib/organization-avatar";

export function createRandomEventAvatarConfig() {
  return createRandomOrganizationAvatarConfig();
}

export function createEventAvatarDataUri(config: OrganizationAvatarConfig) {
  return createOrganizationAvatarDataUri(config);
}

let initialization: Promise<void> | undefined;

export function ensureEventAvatars() {
  if (!initialization) {
    initialization = (async () => {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS EventAvatar (
          eventId TEXT PRIMARY KEY,
          config TEXT NOT NULL,
          FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE CASCADE
        )
      `);

      const events = await db.execute(`
        SELECT e.id
        FROM Event e
        LEFT JOIN EventAvatar a ON a.eventId = e.id
        WHERE a.eventId IS NULL
      `);

      if (events.rows.length > 0) {
        await db.batch(
          events.rows.map((event) => ({
            sql: "INSERT OR IGNORE INTO EventAvatar (eventId, config) VALUES (?, ?)",
            args: [
              event.id as string,
              JSON.stringify(createRandomOrganizationAvatarConfig()),
            ],
          })),
        );
      }
    })().catch((error: unknown) => {
      initialization = undefined;
      throw error;
    });
  }

  return initialization;
}

export function parseEventAvatarDataUri(config: unknown) {
  if (typeof config !== "string") {
    throw new Error("Missing event avatar configuration");
  }
  return createEventAvatarDataUri(parseOrganizationAvatarConfig(config));
}
