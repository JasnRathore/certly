import { createClient } from "@libsql/client";
import * as fs from "fs";

const databaseUrl = process.env.TURSO_DATABASE_URL || "file:./dev.db";
const db = createClient({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const schema = fs.readFileSync("schema.sql", "utf-8");

async function migrate() {
  try {
    const statements = schema.split(";").filter((statement) => statement.trim());
    for (const statement of statements) {
      await db.execute(statement);
    }
    const result = await db.execute(
      "SELECT name FROM sqlite_master WHERE type IN ('table', 'index') AND name NOT LIKE 'sqlite_%'",
    );
    const existingObjects = new Set(result.rows.map((row) => row.name));
    const requiredObjects = [
      "Organization",
      "OrganizationAvatar",
      "User",
      "UserAvatar",
      "OrgMembership",
      "Event",
      "Recipient",
      "OTP",
      "PasswordResetToken",
      "OrgInvite",
      "idx_org_invite_email_status",
      "idx_org_invite_org_status",
      "idx_org_invite_one_pending",
    ];
    const missingObjects = requiredObjects.filter((name) => !existingObjects.has(name));
    if (missingObjects.length > 0) {
      throw new Error(`Migration is missing required objects: ${missingObjects.join(", ")}`);
    }
    console.log(`Migrations applied and verified on ${databaseUrl}.`);
  } finally {
    await db.close();
  }
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
