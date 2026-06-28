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
  // basePath ('/dashboard') is only SOMETIMES stripped from nextUrl.pathname in
  // this multi-zone proxy setup, so normalize it ourselves before matching —
  // otherwise '/dashboard/login' fails the PUBLIC_ROUTES check, the login page
  // gets guarded, and it redirects in a loop to a 404. NextResponse redirects
  // are NOT auto-prefixed, so we also add basePath back onto redirect targets.
  const base = nextUrl.basePath || "/dashboard";
  const path = nextUrl.pathname.startsWith(base)
    ? nextUrl.pathname.slice(base.length) || "/"
    : nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.some((p) => path === p || path.startsWith(p));

  // Unauthenticated users hitting a protected route → /login (with return path).
  if (!isAuthed && !isPublic) {
    const url = new URL(`${base}/login`, nextUrl);
    // callbackUrl stays basePath-relative; the login form's router.push()
    // re-applies basePath automatically.
    url.searchParams.set("callbackUrl", path + nextUrl.search);
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
