import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { env } from "./env";
import { loginResponseSchema, loginSchema } from "./validations";
import { roleFromSlug } from "@/types/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        // DEV ONLY: one-click mock admin so the dashboard can be exercised
        // before the backend tenant is seeded. Guarded by NODE_ENV so it can
        // NEVER bypass auth in production even if the flag is left "true".
        if (env.DEV_AUTH_BYPASS && process.env.NODE_ENV !== "production") {
          return {
            id: "dev-admin",
            name: "Dev Admin",
            email: "dev@mruk.co.tz",
            role: "SUPER_ADMIN",
            accessToken: "dev-mock-token",
          };
        }

        // 1. Validate the input before it touches the network.
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        // 2. Delegate credential verification to the Fanisi backend. The login
        //    route is tenant-scoped, so the tenant header selects the right DB.
        let res: Response;
        try {
          res = await fetch(`${env.BACKEND_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-tenant-slug": env.BACKEND_TENANT_SLUG,
            },
            body: JSON.stringify(parsed.data),
            signal: AbortSignal.timeout(env.BACKEND_API_TIMEOUT),
          });
        } catch {
          return null; // network/timeout → treat as failed login
        }
        if (!res.ok) return null;

        // 3. Validate the backend's response shape before trusting it.
        const json = await res.json().catch(() => null);
        const result = loginResponseSchema.safeParse(json);
        if (!result.success) return null;

        const { user, accessToken } = result.data;
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          // Backend sends a lowercase roleSlug; map it to the dashboard Role.
          role: roleFromSlug(user.roleSlug),
          accessToken,
        };
      },
    }),
  ],
});
