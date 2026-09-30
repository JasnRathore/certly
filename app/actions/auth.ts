'use server';

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { randomInt } from "node:crypto";
import { safeNextPath } from "@/lib/safe-path";
import { createHash, randomBytes } from "node:crypto";
import { getAppOrigin } from "@/lib/app-origin";
import { sendAppEmail } from "@/lib/mail";
import {
  createRandomOrganizationAvatarConfig,
  ensureOrganizationAvatars,
} from "@/lib/organization-avatar";

export type RegisterActionState = {
  error?: string;
  name?: string;
  email?: string;
};

export async function register(
  _previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNextPath(formData.get("next"));

  if (!name) return { error: "Enter your name.", name, email };
  if (name.length > 80) return { error: "Your name must be 80 characters or fewer.", name, email };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address.", name, email };
  }
  if (password.length < 8) {
    return { error: "Choose a password with at least 8 characters.", name, email };
  }

  const existingRes = await db.execute({
    sql: "SELECT id FROM User WHERE lower(email) = lower(?)",
    args: [email],
  });
  if (existingRes.rows.length > 0) {
    return { error: "An account with this email already exists. Sign in instead.", name, email };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  // Generate 6-digit OTP (10 min expiry)
  const code = randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();
  
  const userId = uuidv4();
  const orgId = uuidv4();
  const membershipId = uuidv4();
  await ensureOrganizationAvatars();
  const avatarConfig = JSON.stringify(createRandomOrganizationAvatarConfig());
  
  try {
    await db.batch([
      { sql: "INSERT INTO User (id, name, email, passwordHash) VALUES (?, ?, ?, ?)", args: [userId, name, email, passwordHash] },
      { sql: "INSERT INTO Organization (id, name) VALUES (?, ?)", args: [orgId, `${name}'s Org`] },
      { sql: "INSERT INTO OrganizationAvatar (orgId, config) VALUES (?, ?)", args: [orgId, avatarConfig] },
      { sql: "INSERT INTO OrgMembership (id, userId, orgId, role) VALUES (?, ?, ?, 'ADMIN')", args: [membershipId, userId, orgId] },
      { sql: "INSERT INTO OTP (id, email, code, expiresAt) VALUES (?, ?, ?, ?)", args: [uuidv4(), email, code, expiresAt] }
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("unique") || message.includes("constraint")) {
      return { error: "An account with this email already exists. Sign in instead.", name, email };
    }
    console.error("Failed to create account");
    return { error: "We couldn't create your account right now. Please try again.", name, email };
  }
  
  try {
    await sendAppEmail(email, "Your Certly verification code", `Your code is: ${code}\n\nThis code expires in 10 minutes. Never share it with anyone. If you didn't request this code, you can ignore this email.`, {
      heading: "Verify your Certly account",
      preheader: "Use this one-time code to finish creating your Certly account.",
      intro: "Enter this one-time verification code in Certly to finish creating your account.",
      code,
      details: "This code expires in 10 minutes.",
      note: "Never share this code with anyone. If you didn't request it, you can safely ignore this email.",
    });
  } catch {
    try {
      await db.batch([
        { sql: "DELETE FROM OTP WHERE email = ?", args: [email] },
        { sql: "DELETE FROM OrgMembership WHERE id = ?", args: [membershipId] },
        { sql: "DELETE FROM OrganizationAvatar WHERE orgId = ?", args: [orgId] },
        { sql: "DELETE FROM Organization WHERE id = ?", args: [orgId] },
        { sql: "DELETE FROM User WHERE id = ?", args: [userId] },
      ]);
      return {
        error: "We couldn't send the verification email. Check your email address or try again later.",
        name,
        email,
      };
    } catch {
      console.error("Failed to roll back account after verification email failure");
      return {
        error: "We couldn't send the verification email and couldn't complete signup cleanup. Please contact support.",
        name,
        email,
      };
    }
  }

  redirect(`/verify?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);
}

export async function verifyOtp(email: string, code: string) {
  const res = await db.execute({ sql: "SELECT * FROM OTP WHERE email = ? AND code = ?", args: [email, code] });
  if (res.rows.length === 0) return { error: "Invalid code" };
  
  const otp = res.rows[0];
  if (new Date(otp.expiresAt as string) < new Date()) return { error: "Code expired" };
  
  await db.execute({ sql: "DELETE FROM OTP WHERE email = ?", args: [email] });
  return { success: true };
}

export async function resendVerificationOtp(emailInput: string) {
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address to resend the code." };
  }

  const otpResult = await db.execute({
    sql: "SELECT id, email FROM OTP WHERE lower(email) = lower(?) ORDER BY expiresAt DESC LIMIT 1",
    args: [email],
  });
  const otp = otpResult.rows[0];
  if (!otp) {
    return { error: "No pending verification was found. Please sign in or create your account again." };
  }

  const code = randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const updateResult = await db.execute({
    sql: "UPDATE OTP SET code = ?, expiresAt = ? WHERE id = ?",
    args: [code, expiresAt, otp.id as string],
  });
  if (Number(updateResult.rowsAffected) === 0) {
    return { error: "This verification request is no longer active. Please sign in or create your account again." };
  }

  try {
    await sendAppEmail(
      String(otp.email),
      "Your Certly verification code",
      `Your code is: ${code}\n\nThis code expires in 10 minutes. Never share it with anyone. If you didn't request this code, you can ignore this email.`,
      {
        heading: "Verify your Certly account",
        preheader: "Use this one-time code to finish creating your Certly account.",
        intro: "Enter this one-time verification code in Certly to finish creating your account.",
        code,
        details: "This code expires in 10 minutes.",
        note: "Never share this code with anyone. If you didn't request it, you can safely ignore this email.",
      },
    );
  } catch {
    return { error: "We couldn't send a new code right now. Please try again shortly." };
  }

  return { success: "A new verification code has been sent to your email." };
}

export type LoginActionState = { error?: string };

export async function login(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Enter your email and password." };

  const userResult = await db.execute({
    sql: "SELECT id, email, passwordHash FROM User WHERE lower(email) = lower(?)",
    args: [email],
  });
  const user = userResult.rows[0];

  if (!user) return { error: "No account exists with that email address." };
  if (!user.passwordHash) {
    return { error: "This account uses Google sign-in. Continue with Google." };
  }
  if (!(await bcrypt.compare(password, user.passwordHash as string))) {
    return { error: "The password is incorrect. Try again or reset your password." };
  }

  try {
    const next = safeNextPath(formData.get("next"));
    
    // Check if OTP exists for this email, if so they need to verify
    const otpRes = await db.execute({
      sql: "SELECT id FROM OTP WHERE lower(email) = lower(?)",
      args: [user.email as string],
    });
    if (otpRes.rows.length > 0) {
      redirect(`/verify?email=${encodeURIComponent(user.email as string)}&next=${encodeURIComponent(next)}`);
    }

    await signIn("credentials", { email: user.email as string, password, redirectTo: next });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "We couldn't sign you in. Check your details and try again." };
    }
    throw error;
  }

  return {};
}

async function ensurePasswordResetTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS PasswordResetToken (
      tokenHash TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )
  `);
}

export type PasswordResetActionState = {
  error?: string;
  success?: string;
};

export async function requestPasswordReset(
  _previousState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Enter the email address for your account." };

  const result = await db.execute({
    sql: "SELECT id, email FROM User WHERE lower(email) = lower(?)",
    args: [email],
  });
  const user = result.rows[0];
  if (!user) return { error: "No account exists with that email address." };

  await ensurePasswordResetTable();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = Date.now() + 30 * 60 * 1000;

  await db.batch([
    {
      sql: "DELETE FROM PasswordResetToken WHERE userId = ?",
      args: [user.id as string],
    },
    {
      sql: "INSERT INTO PasswordResetToken (tokenHash, userId, expiresAt) VALUES (?, ?, ?)",
      args: [tokenHash, user.id as string, expiresAt],
    },
  ]);

  const resetUrl = new URL("/reset-password", await getAppOrigin());
  resetUrl.searchParams.set("token", token);

  try {
    await sendAppEmail(
      user.email as string,
      "Reset your Certly password",
      `Use this link to reset your Certly password. It expires in 30 minutes and can only be used once:\n\n${resetUrl.toString()}\n\nIf you didn't request this, you can ignore this email.`,
      {
        heading: "Reset your password",
        preheader: "Use the secure link to choose a new Certly password.",
        intro: "We received a request to reset the password for your Certly account.",
        action: { label: "Reset password", url: resetUrl.toString() },
        details: "This link expires in 30 minutes and can only be used once.",
        note: "If you didn't request a password reset, you can ignore this email. Your password will not change.",
      },
    );
  } catch {
    return { error: "We couldn't send the reset email right now. Please try again later." };
  }

  return { success: "We sent a password reset link to your email address." };
}

export async function resetPassword(
  _previousState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  if (!/^[\da-f]{64}$/i.test(token)) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }
  if (password.length < 8) return { error: "Your password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "The passwords do not match." };

  await ensurePasswordResetTable();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const passwordHash = await bcrypt.hash(password, 10);
  const results = await db.batch([
    {
      sql: `
        UPDATE User
        SET passwordHash = ?
        WHERE id = (
          SELECT userId FROM PasswordResetToken
          WHERE tokenHash = ? AND expiresAt > ?
        )
      `,
      args: [passwordHash, tokenHash, Date.now()],
    },
    {
      sql: "DELETE FROM PasswordResetToken WHERE tokenHash = ?",
      args: [tokenHash],
    },
  ]);

  if (results[0].rowsAffected === 0) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  return { success: "Your password has been reset. You can now sign in." };
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

  await ensureOrganizationAvatars();
  const orgId = uuidv4();
  const membershipId = uuidv4();
  const avatarConfig = JSON.stringify(createRandomOrganizationAvatarConfig());

  await db.batch([
    { sql: "INSERT INTO Organization (id, name) VALUES (?, ?)", args: [orgId, name] },
    { sql: "INSERT INTO OrganizationAvatar (orgId, config) VALUES (?, ?)", args: [orgId, avatarConfig] },
    { sql: "INSERT INTO OrgMembership (id, userId, orgId, role) VALUES (?, ?, ?, 'ADMIN')", args: [membershipId, session.user.id, orgId] }
  ]);

  const cookieStore = await cookies();
  cookieStore.set('active-org-id', orgId, { path: '/' });

  return { orgId };
}

export async function googleSignIn(formData?: FormData) {
  const next = safeNextPath(formData?.get("next"));
  await signIn("google", { redirectTo: next });
}
