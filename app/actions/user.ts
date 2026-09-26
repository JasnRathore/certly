'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function updateUser(data: { name: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await db.execute({
    sql: 'UPDATE users SET name = ? WHERE id = ?',
    args: [data.name, session.user.id],
  });
}

export async function deleteUserAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const userId = session.user.id;

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
