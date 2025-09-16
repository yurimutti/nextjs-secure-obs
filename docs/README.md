# Technical Documentation

## 🇧🇷 Resumo em Português

Este projeto é uma **área de membros segura** construída com Next.js 15, focando em autenticação JWT via cookies HttpOnly, dashboard SSR protegido e observabilidade com Sentry. A documentação técnica segue padrões RFC/ADR para decisões arquiteturais, cobrindo segurança, performance e manutenibilidade.

---

## Overview

This documentation provides comprehensive technical insights into a secure member dashboard built with Next.js 15 App Router. The project demonstrates enterprise-grade patterns for authentication, authorization, and observability in modern React applications.

## Architecture Goals

- **Security First**: HttpOnly cookies, CSRF protection, secure JWT handling
- **Developer Experience**: Type-safe APIs, clear error boundaries, observability
- **Performance**: SSR optimization, efficient client-side state management
- **Maintainability**: Clear separation of concerns, documented decisions

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (private)/         # Protected dashboard routes
│   └── api/               # Route handlers (mocks)
├── components/            # UI components
├── modules/               # Feature modules
│   ├── auth/              # Authentication logic
│   └── dashboard/         # Dashboard features
├── shared/                # Shared utilities
│   ├── libs/              # Core libraries (DAL, session)
│   ├── types/             # TypeScript definitions
│   └── hooks/             # Reusable hooks
└── styles/                # Global styles
```

## Documentation Structure

### 📋 Decision Log

- [decisions-log.md](./decisions/decisions-log.md) - Chronological record of all technical decisions

### 📐 RFC (Request for Comments)

- [RFC 0001: Secure Member Area MVP](./decisions/rfc/0001-secure-member-area-mvp.md) - Initial architecture proposal

### 🏗️ ADR (Architecture Decision Records)

1. [Auth Storage: HttpOnly Cookies](./decisions/adr/0001-auth-storage-httpOnly-cookies.md)
2. [Protected SSR Dashboard: Middleware vs Handler](./decisions/adr/0002-protected-ssr-dashboard-middleware-vs-handler.md)
3. [Client Fetch Authentication Pattern](./decisions/adr/0003-client-fetch-auth-pattern.md)
4. [API Mocks with Route Handlers](./decisions/adr/0004-api-mocks-route-handlers.md)
5. [Sentry Observability Setup](./decisions/adr/0005-sentry-observability-setup.md)
6. [CSRF and State-Changing Requests](./decisions/adr/0006-csrf-and-state-changing-requests.md)
7. [Error Handling and Retry Strategy](./decisions/adr/0007-error-handling-and-retry-strategy.md)
8. [Internationalization, A11y and Responsiveness](./decisions/adr/0008-internationalization-a11y-and-responsiveness.md)

## Documentation Conventions

### Status Labels

- ✅ **Implemented** - Decision implemented and tested
- 🚧 **In Progress** - Currently being implemented
- 📋 **Proposed** - Awaiting approval/implementation
- ❌ **Rejected** - Decision rejected with reasoning
- 📝 **Superseded** - Replaced by newer decision

### Diagram Standards

- **Mermaid** for all technical diagrams
- **Sequence diagrams** for authentication flows
- **Flowcharts** for decision trees
- **Architecture diagrams** for system overview

### Code Examples

- **TypeScript** pseudocode only
- **No real tokens** or sensitive data
- **Focus on patterns** rather than implementation details

## Quick Start for Documentation

1. **New Decision**: Start with RFC if architectural, ADR if technical
2. **Update Log**: Record in `decisions-log.md` with timestamp
3. **Link References**: Cross-reference related decisions
4. **Include Testing**: Add "How to Test" section to each ADR
5. **Mark Status**: Update status as implementation progresses

## Testing Strategy

Each technical decision includes:

- **Unit Test Requirements**
- **Integration Test Scenarios**
- **Manual Testing Steps**
- **Performance Benchmarks** (where applicable)

### DAL (Data Access Layer) Testing

The DAL layer uses **inline mocking** for better test isolation and maintainability:

- **Self-contained tests**: All mocks are defined within the test file (`src/shared/libs/dal/__tests__/index.test.ts`)
- **Simple mock objects**: Basic implementations using Map-based storage for cookies and headers
- **No external dependencies**: Removed dependency on external mock files (`tests/mocks/next-apis.ts`)
- **Next.js integration**: Mocks for `next/headers`, `server-only`, `@sentry/nextjs`, `jose`, and React components

#### Key Testing Functions:
- `mockNextHeaders()` - Simulates Next.js headers and cookies
- `mockServerOnly()` - Mocks server-only directive
- `mockSentry()` - Stubs Sentry logging functions
- `mockJose()` - Mocks JWT verification and signing
- `resetMocks()` - Cleans state between tests

#### Running DAL Tests:
```bash
npm test -- --testPathPattern=dal
```

## Contributing

When making architectural changes:

1. Create ADR first
2. Get peer review
3. Implement with tests
4. Update decision log
5. Mark ADR as implemented

---

_Last updated: January 2025_
