import type { DefaultSession } from "next-auth";
import type { Permission, Role } from "@/types";

declare module "next-auth" {
  interface User {
    id?: string;
    role: Role;
    permissions: Permission[];
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      permissions: Permission[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    permissions: Permission[];
  }
}
