"use client";

import { useState, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bug, CheckCircle, AlertTriangle } from "lucide-react";

class DashboardSentryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardSentryError";
  }
}

export function SentryErrorTest() {
  const [hasSentError, setHasSentError] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkConnectivity() {
      try {
        const result = await Sentry.diagnoseSdkConnectivity();
        setIsConnected(result !== "sentry-unreachable");
      } catch {
        setIsConnected(false);
      }
    }
    checkConnectivity();
  }, []);

  const handleThrowError = async () => {
    setIsLoading(true);
    try {
      await Sentry.startSpan(
        { name: "Dashboard Error Test", op: "test" },
        async () => {
          const err = new DashboardSentryError(
            "Test error from dashboard (client) — Sentry smoke"
          );
          Sentry.captureException(err, {
            tags: { area: "dashboard", kind: "smoke" },
            level: "error",
          });
          await Sentry.flush(2000);
          setHasSentError(true);
        }
      );
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionStatus = () => {
    if (isConnected === null) {
      return {
        variant: "secondary" as const,
        label: "Checking...",
        icon: null,
      };
    }
    if (isConnected) {
      return {
        variant: "default" as const,
        label: "Connected",
        icon: CheckCircle,
      };
    }
    return {
      variant: "destructive" as const,
      label: "Disconnected",
      icon: AlertTriangle,
    };
  };

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Sentry Error Testing
            </CardTitle>
            <CardDescription>
              Test error reporting integration with your Sentry dashboard
            </CardDescription>
          </div>
          <Badge
            variant={connectionStatus.variant}
            className="flex items-center gap-1"
          >
            {StatusIcon && <StatusIcon className="h-3 w-3" />}
            {connectionStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Click the button below to throw a test error that will be captured
            by Sentry. This helps verify your error monitoring is working
            correctly.
          </p>

          <Button
            onClick={handleThrowError}
            disabled={!isConnected || isLoading}
            variant="outline"
            className="w-full"
          >
            <Bug className="h-4 w-4 mr-2" />
            {isLoading ? "Throwing Error..." : "Throw Test Error"}
          </Button>
        </div>

        {hasSentError && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Test error sent to Sentry successfully. Check your{" "}
              <a
                href="https://sentry.io"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-green-900"
              >
                Sentry Dashboard
              </a>{" "}
              to view the error.
            </AlertDescription>
          </Alert>
        )}

        {isConnected === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to Sentry. Please check your network connection
              or disable ad-blockers that might be blocking Sentry requests.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
