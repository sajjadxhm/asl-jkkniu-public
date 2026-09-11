import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { loginSchema } from "@/lib/validations/auth";

export const { auth, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.isActive || !user.passwordHash) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
      } else if (token.role === "RESEARCHER" && typeof token.id === "string") {
        // Password changes and admin resets must take effect for existing JWTs.
        // Read the database instead of trusting a client-provided session update.
        const account = await prisma.user.findUnique({
          where: { id: token.id },
          select: { mustChangePassword: true },
        });

        if (!account) {
          return null;
        }

        token.mustChangePassword = account.mustChangePassword;
      }

      return token;
    },

  async session({ session, token }) {
if (session.user) {
  if (typeof token.id === "string") {
    session.user.id = token.id;
  }

  if (
    token.role === "SUPER_ADMIN" ||
    token.role === "ADMIN" ||
    token.role === "EDITOR" ||
    token.role === "RESEARCHER"
  ) {
    session.user.role = token.role;
  }

  session.user.mustChangePassword =
    token.mustChangePassword === true;
}

  return session;
  },
  },
});