"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook a real logger (Sentry, etc.) in here later.
    console.error(error);
  }, [error]);

  return (
    <div className="py-10">
      <ErrorState
        title="This page failed to load"
        message="An unexpected error occurred. You can retry, or head back to the dashboard."
        onRetry={reset}
      />
    </div>
  );
}
