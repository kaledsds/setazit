import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { env } from "@/env";
import type { GetServerSidePropsContext } from "next";
import bcrypt from "bcryptjs";
import type { Session } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   role: string;
  // }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
  },
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
            },
          });

          if (!user?.password) {
            return null;
          }
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const activeSession = await db.session.findFirst({
        where: { userId: user.id },
        select: { sessionType: true },
        orderBy: { expires: "desc" },
      });

      session.user.id = user.id;
      // session.user.role = user.role ?? "user";
      (session as unknown as Session).sessionType =
        activeSession?.sessionType ?? null;

      return session;
    },

    redirect: () => {
      return "/session-type-selection";
    },
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  console.log("🔍 Incoming cookies:", ctx.req.headers.cookie);
  return getServerSession(ctx.req, ctx.res, authOptions);
};
