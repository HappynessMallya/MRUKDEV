import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Lightweight, edge-safe instance — no credential provider bundled here.
const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = ["/login"];

function withSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  return res;
}

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthed = Boolean(req.auth);
  const isPublic = PUBLIC_ROUTES.some((p) => nextUrl.pathname.startsWith(p));

  // In middleware, nextUrl.pathname is basePath-stripped, and NextResponse
  // redirects are NOT auto-prefixed — so we add basePath ('/dashboard') back
  // onto absolute redirect targets to keep them inside this zone.
  const base = nextUrl.basePath || "";

  // Unauthenticated users hitting a protected route → /login (with return path).
  if (!isAuthed && !isPublic) {
    const url = new URL(`${base}/login`, nextUrl);
    // callbackUrl stays basePath-relative; the login form's router.push()
    // re-applies basePath automatically.
    url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  // Authenticated users on the login page → dashboard home.
  if (isAuthed && isPublic) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL(`${base}/`, nextUrl)),
    );
  }

  return withSecurityHeaders(NextResponse.next());
});

export const config = {
  // Run on everything except API auth routes, static assets, and files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
