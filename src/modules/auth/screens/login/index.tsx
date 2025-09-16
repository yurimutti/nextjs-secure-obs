"use client";

import { signin } from "@/modules/auth/actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginScreen() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-lg" role="main">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold" id="login-heading">Login</CardTitle>
          <CardDescription id="login-description">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={action} className="space-y-4" aria-labelledby="login-heading" aria-describedby="login-description">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                aria-describedby={state?.errors?.email ? "email-error" : undefined}
                aria-invalid={state?.errors?.email ? "true" : "false"}
              />
            </div>
            {state?.errors?.email && (
              <p className="text-red-500 text-sm" id="email-error" role="alert" aria-live="polite">{state.errors.email}</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                aria-describedby={state?.errors?.password ? "password-error" : undefined}
                aria-invalid={state?.errors?.password ? "true" : "false"}
              />
            </div>
            {state?.errors?.password && (
              <p className="text-red-500 text-sm" id="password-error" role="alert" aria-live="polite">{state.errors.password}</p>
            )}

            {state?.message && (
              <p className="text-red-500 text-sm" role="alert" aria-live="polite">{state.message}</p>
            )}

            <Button
              disabled={pending}
              type="submit"
              className="w-full"
              aria-describedby="login-description"
            >
              {pending ? "Logging In..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
