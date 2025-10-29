import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        let valid = false;
        try {
          // Prefer bcrypt comparison when the stored hash is bcrypt
          if (user.passwordHash.startsWith('$2')) {
            valid = await bcrypt.compare(credentials.password, user.passwordHash);
          } else {
            // Backward compatibility: accept legacy plain-text stored password
            valid = credentials.password === user.passwordHash;
            if (valid) {
              // Upgrade to bcrypt hash transparently
              const newHash = await bcrypt.hash(credentials.password, 10);
              await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
            }
          }
        } catch {
          valid = false;
        }
        if (!valid) return null;
        return { id: user.id, email: user.email } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token as any;
    },
    async session({ session, token }) {
      (session.user as any).id = (token as any).id;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};


