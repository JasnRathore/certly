import { db } from "@/lib/db";
import {
  defaultUserAvatarConfig,
  isUserAvatarConfig,
  type UserAvatarConfig,
} from "@/lib/user-avatar";

export async function ensureUserAvatarTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS UserAvatar (
      userId TEXT PRIMARY KEY,
      config TEXT NOT NULL,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )
  `);
}

export async function getUserAvatarConfig(userId: string): Promise<UserAvatarConfig> {
  await ensureUserAvatarTable();
  const result = await db.execute({
    sql: "SELECT config FROM UserAvatar WHERE userId = ?",
    args: [userId],
  });

  return parseUserAvatarConfig(result.rows[0]?.config, userId);
}

export function parseUserAvatarConfig(
  stored: unknown,
  userId: string,
): UserAvatarConfig {
  if (typeof stored !== "string") {
    return { ...defaultUserAvatarConfig, seed: userId };
  }

  const config: unknown = JSON.parse(stored);
  const normalizedConfig =
    typeof config === "object" &&
    config !== null &&
    "style" in config &&
    config.style === "slice"
      ? { ...config, style: "thumbs" }
      : config;

  return isUserAvatarConfig(normalizedConfig)
    ? normalizedConfig
    : { ...defaultUserAvatarConfig, seed: userId };
}
