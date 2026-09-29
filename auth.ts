import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import {
  createRandomOrganizationAvatarConfig,
  ensureOrganizationAvatars,
} from '@/lib/organization-avatar';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const res = await db.execute({
          sql: 'SELECT * FROM User WHERE lower(email) = lower(?)',
          args: [credentials.email as string]
        });
        
        const user = res.rows[0];
        if (!user) return null;

        const isMatch = await bcrypt.compare(credentials.password as string, user.passwordHash as string);
        if (!isMatch) return null;

        return {
          id: user.id as string,
          name: user.name as string,
          email: user.email as string,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const res = await db.execute({
          sql: 'SELECT id FROM User WHERE email = ?',
          args: [user.email]
        });
        
        if (res.rows.length === 0) {
          const { v4: uuidv4 } = await import('uuid');
          const userId = uuidv4();
          const orgId = uuidv4();
          const membershipId = uuidv4();
          
          const orgName = (user.name || 'User') + "'s Org";
          await ensureOrganizationAvatars();
          const avatarConfig = JSON.stringify(createRandomOrganizationAvatarConfig());
          
          await db.batch([
            { sql: "INSERT INTO User (id, name, email, passwordHash) VALUES (?, ?, ?, '')", args: [userId, user.name || 'User', user.email] },
            { sql: "INSERT INTO Organization (id, name) VALUES (?, ?)", args: [orgId, orgName] },
            { sql: "INSERT INTO OrganizationAvatar (orgId, config) VALUES (?, ?)", args: [orgId, avatarConfig] },
            { sql: "INSERT INTO OrgMembership (id, userId, orgId, role) VALUES (?, ?, ?, 'ADMIN')", args: [membershipId, userId, orgId] }
          ]);
          user.id = userId;
        } else {
          user.id = res.rows[0].id as string;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  }
});
