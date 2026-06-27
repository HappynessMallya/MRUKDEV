import "server-only";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { env } from "@/lib/env";

/**
 * Reads the backend access token from the encrypted, httpOnly session JWT.
 * The token is NEVER copied onto the client-facing session object, so it
 * cannot leak via `useSession()` or `/api/auth/session`.
 */
export async function getAccessToken(): Promise<string | null> {
  const cookie = (await headers()).get("cookie") ?? "";
  const token = await getToken({
    req: new Request("http://localhost", { headers: { cookie } }),
    secret: env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  return token?.accessToken ?? null;
}
