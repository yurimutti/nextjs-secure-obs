# ADR-0005: Sentry Observability Setup

**Status**: ✅ Implemented
**Date**: September 16, 2025
**Decision Makers**: Development Team, DevOps Team
**Consulted**: Security Team
**Informed**: Product Team

## Context

The secure member area requires comprehensive observability for monitoring errors, performance, and user experience. We need to track authentication failures, API errors, client-side issues, and performance metrics across the entire application.

### Problem Statement

- Need visibility into production errors and performance issues
- Monitor authentication flows and security events
- Track user experience and Core Web Vitals
- Debug complex authentication and API integration issues
- Maintain privacy and security while collecting observability data

## Decision

**We will implement Sentry for comprehensive error tracking, performance monitoring, and user experience observability with privacy-first configuration.**

### Implementation Strategy

```typescript
// Client-side configuration
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  beforeSend(event, hint) {
    // Remove sensitive data
    return sanitizeEvent(event);
  },
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: ["localhost", /^\/api/],
    }),
  ],
});
```

## Authentication & API Error Tracking

```typescript
// Authentication flow monitoring
export async function signin(prevState: any, formData: FormData) {
  try {
    Sentry.addBreadcrumb({
      message: "Starting authentication flow",
      category: "auth",
      level: "info",
    });

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      Sentry.captureMessage("Authentication failed", {
        level: "warning",
        tags: { flow: "login" },
        extra: { status: response.status },
      });
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { component: "auth", action: "login" },
    });
  }
}
```

## Consequences

**Positive**: Complete error visibility, performance monitoring, security event tracking
**Negative**: Additional bundle size, privacy considerations, third-party dependency

## Implementation Files

- `sentry.client.config.ts` - Client configuration
- `sentry.server.config.ts` - Server configuration
- Authentication flows with Sentry integration

**Related ADRs**: [ADR-0007](./0007-error-handling-and-retry-strategy.md) - Error handling patterns
