import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config: no providers, no Node-only deps. Imported by both
 * the full server auth (lib/auth.ts) and the proxy/route guard so the
 * middleware bundle stays lightweight.
 */
export const authConfig = {
  // The app runs under basePath '/dashboard' (multi-zone), so Auth.js routes
  // live at /dashboard/api/auth/*. This must match the SessionProvider basePath
  // on the client (components/providers.tsx) or sign-in requests 404.
  basePath: "/dashboard/api/auth",
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
