'use server';
import { db } from "@/lib/db";
import { getActiveOrg } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function updateOrgSettings(formData: FormData) {
  const { organization, role } = await getActiveOrg();
  if (role !== "ADMIN") throw new Error("Unauthorized");

  const gmailAddress = formData.get("gmailAddress") as string;
  const gmailAppPassword = formData.get("gmailAppPassword") as string;

  if (gmailAppPassword) {
    await db.execute({
      sql: 'UPDATE Organization SET gmailAddress = ?, gmailAppPassword = ? WHERE id = ?',
      args: [gmailAddress, gmailAppPassword, organization.id]
    });
  } else {
    await db.execute({
      sql: 'UPDATE Organization SET gmailAddress = ? WHERE id = ?',
      args: [gmailAddress, organization.id]
    });
  }

  revalidatePath('/settings');
}
