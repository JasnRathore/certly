'use server';

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "All fields are required" };

  const existingRes = await db.execute({ sql: "SELECT id FROM User WHERE email = ?", args: [email] });
  if (existingRes.rows.length > 0) return { error: "Email already exists" };

  const passwordHash = await bcrypt.hash(password, 10);
  
  // Generate 6-digit OTP (10 min expiry)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();
  
  const userId = uuidv4();
  const orgId = uuidv4();
  const membershipId = uuidv4();
  
  await db.batch([
    { sql: "INSERT INTO User (id, name, email, passwordHash) VALUES (?, ?, ?, ?)", args: [userId, name, email, passwordHash] },
    { sql: "INSERT INTO Organization (id, name) VALUES (?, ?)", args: [orgId, `${name}'s Org`] },
    { sql: "INSERT INTO OrgMembership (id, userId, orgId, role) VALUES (?, ?, ?, 'ADMIN')", args: [membershipId, userId, orgId] },
    { sql: "INSERT INTO OTP (id, email, code, expiresAt) VALUES (?, ?, ?, ?)", args: [uuidv4(), email, code, expiresAt] }
  ]);
  
  // Send email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your Verification Code",
    text: `Your code is: ${code}`
  });

  redirect(`/verify?email=${encodeURIComponent(email)}`);
}

export async function verifyOtp(email: string, code: string) {
  const res = await db.execute({ sql: "SELECT * FROM OTP WHERE email = ? AND code = ?", args: [email, code] });
  if (res.rows.length === 0) return { error: "Invalid code" };
  
  const otp = res.rows[0];
  if (new Date(otp.expiresAt as string) < new Date()) return { error: "Code expired" };
  
  await db.execute({ sql: "DELETE FROM OTP WHERE email = ?", args: [email] });
  return { success: true };
}

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Check if OTP exists for this email, if so they need to verify
    const otpRes = await db.execute({ sql: "SELECT id FROM OTP WHERE email = ?", args: [email] });
    if (otpRes.rows.length > 0) {
      redirect(`/verify?email=${encodeURIComponent(email)}`);
    }

    await signIn("credentials", { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" };
    }
    throw error;
  }
}

export async function setActiveOrg(orgId: string) {
  const cookieStore = await cookies();
  cookieStore.set('active-org-id', orgId, { path: '/' });
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}

export async function createOrg(name: string) {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const orgId = uuidv4();
  const membershipId = uuidv4();

  await db.batch([
    { sql: "INSERT INTO Organization (id, name) VALUES (?, ?)", args: [orgId, name] },
    { sql: "INSERT INTO OrgMembership (id, userId, orgId, role) VALUES (?, ?, ?, 'ADMIN')", args: [membershipId, session.user.id, orgId] }
  ]);

  const cookieStore = await cookies();
  cookieStore.set('active-org-id', orgId, { path: '/' });

  return { orgId };
}

export async function googleSignIn() {
  await signIn("google", { redirectTo: '/' });
}
