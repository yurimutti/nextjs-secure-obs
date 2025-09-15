"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as Sentry from "@sentry/nextjs";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Capture the error in Sentry with rich context
    Sentry.captureException(error, {
      tags: {
        component: "error-boundary",
        location: "app-level",
      },
      extra: {
        digest: error.digest,
        errorMessage: error.message,
        errorStack: error.stack,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      },
      level: "error",
    });

    // Also log to console for development
    console.error("Application error:", error);

    // Add breadcrumb for user actions leading to error
    Sentry.addBreadcrumb({
      message: "Application error boundary triggered",
      category: "error",
      level: "error",
      data: {
        errorMessage: error.message,
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. We&apos;ve been notified and are working on
            a fix.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Details</AlertTitle>
          <AlertDescription className="mt-2 text-sm">
            {error.message || "An unknown error occurred"}
            {error.digest && (
              <div className="mt-2 text-xs opacity-70">
                Error ID: {error.digest}
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              Sentry.addBreadcrumb({
                message: "User clicked 'Try again' in error boundary",
                category: "ui",
                level: "info",
              });
              reset();
            }}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              Sentry.addBreadcrumb({
                message: "User clicked 'Go home' in error boundary",
                category: "ui",
                level: "info",
              });
              router.push("/");
            }}
            className="w-full"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}