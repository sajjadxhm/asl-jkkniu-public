import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL is not configured.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const name = process.env.NEW_SUPER_ADMIN_NAME?.trim();
  const email = process.env.NEW_SUPER_ADMIN_EMAIL
    ?.trim()
    .toLowerCase();
  const password = process.env.NEW_SUPER_ADMIN_PASSWORD;

  if (!name) {
    throw new Error(
      "NEW_SUPER_ADMIN_NAME is not configured.",
    );
  }

  if (!email) {
    throw new Error(
      "NEW_SUPER_ADMIN_EMAIL is not configured.",
    );
  }

  if (!password) {
    throw new Error(
      "NEW_SUPER_ADMIN_PASSWORD is not configured.",
    );
  }

  if (password.length < 12) {
    throw new Error(
      "Password must be at least 12 characters long.",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error(
      `A user with email "${email}" already exists. No changes were made.`,
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
      mustChangePassword: true,
    },
  });

  console.log("Super Admin created successfully.");
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`User ID: ${user.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });