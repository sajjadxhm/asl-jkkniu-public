import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is not configured.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error("ADMIN_EMAIL is not configured.");
  }

  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }
  if (bcrypt.truncates(password)) throw new Error("ADMIN_PASSWORD must be 72 UTF-8 bytes or fewer.");

  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    throw new Error("Account already exists. Bootstrap does not reset passwords or promote accounts.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
    name: "System Administrator",
    email,
    passwordHash,
    role: "SUPER_ADMIN",
    isActive: true,
},
  });

  console.log(`Admin user ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
