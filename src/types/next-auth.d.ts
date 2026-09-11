import { DefaultSession } from "next-auth";

declare module "next-auth" {
interface Session {
  user: {
    id: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "RESEARCHER";
    mustChangePassword: boolean;
  } & DefaultSession["user"];
}

interface User {
  id: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "RESEARCHER";
  mustChangePassword: boolean;
}
}

declare module "next-auth/jwt" {
interface JWT {
  id: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "RESEARCHER";
  mustChangePassword: boolean;
}
}