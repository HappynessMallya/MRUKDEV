import { Suspense } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/components/forms/login-form";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  // Matches the server-side gate in auth.ts: DEV_AUTH_BYPASS is the only
  // switch and applies everywhere (including production). Turn it off before
  // connecting the real backend.
  const devBypass = env.DEV_AUTH_BYPASS;
  return (
    <div className="bg-muted/30 flex min-h-dvh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">MRUK</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to the operations dashboard
          </p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LoginForm devBypass={devBypass} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
