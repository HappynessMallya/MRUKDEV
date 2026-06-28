import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config: no providers, no Node-only deps. Imported by both
 * the full server auth (lib/auth.ts) and the proxy/route guard so the
 * middleware bundle stays lightweight.
 */
export const authConfig = {
  // NOTE on basePath under multi-zone: the app runs with Next basePath
  // '/dashboard', and Next STRIPS that prefix before the request reaches this
  // route handler — so server-side Auth.js sees '/api/auth/*' and must keep the
  // DEFAULT basePath ('/api/auth'). Only the browser-facing client needs the
  // full '/dashboard/api/auth' (set on <SessionProvider basePath> in
  // components/providers.tsx), because the browser builds absolute URLs that
  // still include '/dashboard'. Setting basePath here breaks action parsing.
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24h, per security checklist
  },
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session({ session, token }) {
      // Only non-secret fields go on the client-facing session.
      // The backend accessToken stays in the JWT (see lib/auth-token.ts).
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
