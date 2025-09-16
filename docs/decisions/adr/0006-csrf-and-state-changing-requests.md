# ADR-0006: CSRF and State-Changing Requests

**Status**: ✅ Implemented
**Date**: January 16, 2025
**Decision Makers**: Security Team, Development Team
**Consulted**: Infrastructure Team
**Informed**: Product Team

## Context

The application handles state-changing operations (login, logout, data modifications) that require protection against Cross-Site Request Forgery (CSRF) attacks while maintaining a seamless user experience.

### Problem Statement

- Protect against CSRF attacks on authentication endpoints
- Secure state-changing API operations
- Maintain usability with automatic form handling
- Balance security with development complexity

## Decision

**We will use SameSite=Strict cookies as the primary CSRF protection mechanism, supplemented by origin validation for additional security.**

### CSRF Protection Strategy

```typescript
// Cookie configuration with CSRF protection
const securityConfig = {
  sameSite: "strict" as const, // Primary CSRF protection
  httpOnly: true, // XSS protection
  secure: process.env.NODE_ENV === "production", // HTTPS only
  path: restrictedPath, // Path-based restrictions
};
```

### Origin Validation Pattern

```typescript
// Additional origin validation for critical operations
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // Allow same-origin requests
  return origin === `https://${host}` || origin === `http://${host}`; // Development only
}
```

## Implementation

### Authentication Endpoints

- **Login**: SameSite=Strict + origin validation
- **Logout**: SameSite=Strict + origin validation
- **Token Refresh**: Path restrictions + SameSite=Strict

### State-Changing APIs

- All POST/PUT/DELETE operations validate SameSite cookies
- Critical operations include additional origin checks
- Idempotent operations designed for retry safety

## Consequences

**Positive**: Strong CSRF protection, minimal complexity, no client-side token management
**Negative**: Stricter same-site requirements, potential issues with legitimate cross-origin requests

## Testing Strategy

- Manual CSRF attack simulation
- Cross-origin request testing
- Browser compatibility validation

**Related ADRs**: [ADR-0001](./0001-auth-storage-httpOnly-cookies.md) - Cookie configuration
