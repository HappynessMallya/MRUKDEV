import "server-only";
import type { z } from "zod";
import { getAccessToken } from "@/lib/auth-token";
import { env } from "@/lib/env";

/** Normalized error thrown by the API client; safe to surface to the UI. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface ApiFetchOptions<S extends z.ZodTypeAny | undefined> {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Query;
  /** Zod schema to validate & type the response. Omit for `void`/unknown. */
  schema?: S;
  /** Attach the caller's backend access token. Default: true. */
  authenticated?: boolean;
  /** Next.js fetch cache controls. */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
}

type Result<S> = S extends z.ZodTypeAny ? z.infer<S> : unknown;

function buildUrl(path: string, query?: Query): string {
  const base = env.BACKEND_API_URL.replace(/\/$/, "");
  const url = new URL(`${base}/${path.replace(/^\//, "")}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Server-only fetch wrapper for the backend API.
 * - Attaches the session's backend access token (never exposed to the client).
 * - Validates responses with Zod when a schema is provided.
 * - Throws a typed {@link ApiError} on non-2xx or network failure.
 */
export async function apiFetch<S extends z.ZodTypeAny | undefined = undefined>(
  path: string,
  options: ApiFetchOptions<S> = {},
): Promise<Result<S>> {
  const {
    method = "GET",
    body,
    query,
    schema,
    authenticated = true,
    cache,
    next,
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    // Tenant routing — the backend selects this tenant's DB from the header.
    // Required on every tenant-scoped route.
    "x-tenant-slug": env.BACKEND_TENANT_SLUG,
  };

  if (authenticated) {
    const token = await getAccessToken();
    if (!token) {
      throw new ApiError(401, "Not authenticated");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(env.BACKEND_API_TIMEOUT),
      cache,
      next,
    });
  } catch (err) {
    const message =
      err instanceof Error && err.name === "TimeoutError"
        ? "The request timed out. Please try again."
        : "Could not reach the server. Check your connection.";
    throw new ApiError(503, message);
  }

  if (!res.ok) {
    const details = await res.json().catch(() => undefined);
    const message =
      (details && typeof details === "object" && "message" in details
        ? String((details as { message: unknown }).message)
        : undefined) ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, details);
  }

  if (res.status === 204) {
    return undefined as Result<S>;
  }

  const json = await res.json().catch(() => {
    throw new ApiError(502, "Received an invalid response from the server.");
  });

  if (schema) {
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      throw new ApiError(502, "Unexpected response shape from the server.", parsed.error.flatten());
    }
    return parsed.data as Result<S>;
  }

  return json as Result<S>;
}
