import Papa from 'papaparse';
import { Recipient } from './types';

export function parseRecipientsCsv(csvContent: string): Omit<Recipient, 'status'>[] {
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const recipients: Omit<Recipient, 'status'>[] = [];

  for (const row of parsed.data as any[]) {
    // Try to find name and email columns case-insensitively
    const keys = Object.keys(row);
    const nameKey = keys.find(k => k.toLowerCase().trim() === 'name');
    const emailKey = keys.find(k => k.toLowerCase().trim() === 'email');

    if (nameKey && emailKey && row[nameKey] && row[emailKey]) {
      recipients.push({
        name: row[nameKey].trim(),
        email: row[emailKey].trim(),
      });
    }
  }

  return recipients;
}
