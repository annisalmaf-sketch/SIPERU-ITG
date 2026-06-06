import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "DEFINED" : "UNDEFINED");

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "ITG_BOOKING_SECRET_KEY_123_FALLBACK_SUPER_SECRET",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        identifier: { label: "Email Address", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        let user = await prisma.user.findFirst({
          where: {
            email: credentials.identifier,
          },
        });

        if (!user) {
          // Auto-register for Mahasiswa and Dosen using @itg.ac.id
          if (
            credentials.identifier.endsWith("@itg.ac.id") && 
            credentials.password === "itg@garut"
          ) {
            const idStr = credentials.identifier.split("@")[0]; // e.g., hima
            const isDosen = idStr.startsWith("dsn") || idStr.startsWith("dosen");
            const roleDb = isDosen ? "DOSEN" : "MAHASISWA";
            const idPrefix = isDosen ? "dsn" : "mhs";
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash("itg@garut", 10);

            user = await prisma.user.create({
              data: {
                id: `${idPrefix}-${idStr}`,
                email: credentials.identifier,
                name: `${roleDb === "DOSEN" ? "Dosen" : "Mahasiswa"} ${idStr}`,
                password: hashedPassword,
                role: roleDb,
              }
            });
          } else {
            return null;
          }
        }

        const bcrypt = require('bcryptjs');
        // Support backward compatibility for old accounts that still use plain text passwords
        const isPasswordValid = user.password.startsWith('$2') 
          ? await bcrypt.compare(credentials.password, user.password)
          : credentials.password === user.password;
        
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.name = user.name;
      }
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
