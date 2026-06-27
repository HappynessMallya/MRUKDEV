import "server-only";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasAtLeastRole, type Role } from "@/types/auth";
import { ApiError } from "@/lib/api/client";

type SessionUser = Session["user"];

/**
 * Require an authenticated session in a Server Component / Route Handler.
 * Redirects unauthenticated users to /login.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/**
 * Guard a Server Action: returns the user when authorized, otherwise throws.
 * Use at the very top of every mutation, e.g. `const user = await requireRole("EDITOR")`.
 */
export async function requireRole(required: Role): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user) {
    throw new ApiError(401, "You must be signed in to do that.");
  }
  if (!hasAtLeastRole(session.user.role, required)) {
    throw new ApiError(403, "You don't have permission to do that.");
  }
  return session.user;
}
