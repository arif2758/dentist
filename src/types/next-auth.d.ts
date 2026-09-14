import { DefaultSession } from "next-auth";
import { UserRole } from "./auth";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    phone?: string;
    status?: "active" | "inactive";
  }

  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      phone?: string;
      status?: "active" | "inactive";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    phone?: string;
    status?: "active" | "inactive";
  }
}
