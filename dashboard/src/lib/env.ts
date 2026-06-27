import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe, validated environment variables.
 * Server vars are NEVER bundled into the client. The backend base URL and
 * auth secret stay server-only by design — the browser talks to this app's
 * Route Handlers / Server Actions, which proxy to the backend.
 */
export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
    AUTH_URL: z.string().url().optional(),
    BACKEND_API_URL: z.string().url("BACKEND_API_URL must be a valid URL"),
    BACKEND_API_TIMEOUT: z.coerce.number().int().positive().default(15000),
    /**
     * Tenant slug sent in the `x-tenant-slug` header on every backend call.
     * The backend selects this tenant's database from it. Registered as
     * `mr-uk` (hyphenated) for the MRUK storefront.
     */
    BACKEND_TENANT_SLUG: z.string().min(1).default("mr-uk"),
    /**
     * DEV ONLY. When "true" (and not in production), enables a one-click mock
     * admin login so the dashboard can be tested before the backend is ready.
     */
    DEV_AUTH_BYPASS: z
      .string()
      .optional()
      .transform((v) => v === "true"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    BACKEND_API_TIMEOUT: process.env.BACKEND_API_TIMEOUT,
    BACKEND_TENANT_SLUG: process.env.BACKEND_TENANT_SLUG,
    DEV_AUTH_BYPASS: process.env.DEV_AUTH_BYPASS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  emptyStringAsUndefined: true,
});
