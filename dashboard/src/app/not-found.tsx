import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-brand text-sm font-semibold tracking-wide uppercase">
        404
      </p>
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
