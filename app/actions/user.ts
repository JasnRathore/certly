'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { isUserAvatarConfig, type UserAvatarConfig } from '@/lib/user-avatar';
import { ensureUserAvatarTable } from '@/lib/user-avatar-storage';

export async function updateUser(data: { name: string; avatarConfig: UserAvatarConfig }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  if (typeof data?.name !== 'string') throw new Error('A display name is required.');
  const name = data.name.trim();
  if (!name || name.length > 80) throw new Error('Name must be between 1 and 80 characters.');
  if (!isUserAvatarConfig(data.avatarConfig)) throw new Error('Invalid avatar configuration.');

  await ensureUserAvatarTable();
  await db.batch([
    {
      sql: 'UPDATE User SET name = ? WHERE id = ?',
      args: [name, session.user.id],
    },
    {
      sql: `
        INSERT INTO UserAvatar (userId, config)
        VALUES (?, ?)
        ON CONFLICT(userId) DO UPDATE SET
          config = excluded.config,
          updatedAt = CURRENT_TIMESTAMP
      `,
      args: [session.user.id, JSON.stringify(data.avatarConfig)],
    },
  ]);
}

export async function deleteUserAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const userId = session.user.id;

  await ensureUserAvatarTable();
  await db.execute({
    sql: 'DELETE FROM UserAvatar WHERE userId = ?',
    args: [userId],
  });

  // Delete all memberships for this user
  await db.execute({
    sql: 'DELETE FROM organization_members WHERE user_id = ?',
    args: [userId],
  });

  // For simplicity in this action, we are just removing the user.
  // We could also delete organizations where they are the sole owner,
  // but that requires more complex logic.
  
  // Delete the user
  await db.execute({
    sql: 'DELETE FROM users WHERE id = ?',
    args: [userId],
  });
}
