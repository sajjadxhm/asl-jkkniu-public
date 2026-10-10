import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createHash } from "node:crypto";

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
          passwordVersion: createHash("sha256").update(user.passwordHash).digest("hex"),
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
        token.passwordVersion = user.passwordVersion;
      }
      if (typeof token.id === "string") {
        // Never accept client session-update claims. Password changes revoke old JWTs.
        const account = await prisma.user.findUnique({
          where: { id: token.id },
          select: { name: true, email: true, role: true, isActive: true, passwordHash: true, mustChangePassword: true },
        });

        if (!account?.isActive || token.passwordVersion !== createHash("sha256").update(account.passwordHash).digest("hex")) {
          return null;
        }

        token.role = account.role;
        token.name = account.name;
        token.email = account.email;
        token.mustChangePassword = account.mustChangePassword;
      } else return null;

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
