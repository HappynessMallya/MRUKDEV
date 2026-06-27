import type { DefaultSession } from "next-auth";
import type { Role } from "@/types/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: Role;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    accessToken: string;
  }
}

// NextAuth v5 resolves the JWT type from @auth/core/jwt in some contexts.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    accessToken: string;
  }
}
