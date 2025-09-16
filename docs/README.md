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

This project follows a feature-based architecture with clear separation of concerns:

```
├── src/
│   ├── app/                     # Next.js 15 App Router
│   │   ├── (auth)/             # Authentication route group
│   │   ├── (private)/          # Protected route group
│   │   ├── api/                # API route handlers
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing page
│   │   ├── error.tsx           # Error boundary
│   │   └── global-error.tsx    # Global error handler
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── header/             # Header navigation
│   │   ├── sidebar/            # Dashboard sidebar
│   │   ├── loading/            # Loading components
│   │   ├── error/              # Error components
│   │   └── skip-link/          # Accessibility components
│   │
│   ├── modules/                # Feature modules
│   │   ├── auth/               # Authentication module
│   │   │   ├── components/     # Auth-specific components
│   │   │   ├── services/       # Auth API services
│   │   │   └── types/          # Auth type definitions
│   │   └── dashboard/          # Dashboard module
│   │       ├── components/     # Dashboard components
│   │       ├── services/       # Dashboard API services
│   │       └── types/          # Dashboard types
│   │
│   ├── providers/              # React context providers
│   │   ├── auth-provider/      # Authentication state
│   │   └── query-provider/     # React Query setup
│   │
│   ├── shared/                 # Shared utilities and libraries
│   │   ├── constants/          # Application constants
│   │   ├── hooks/              # Custom React hooks
│   │   ├── libs/               # Utility libraries
│   │   │   ├── dal/           # Data Access Layer (SSR auth)
│   │   │   └── session/       # Session management
│   │   ├── types/              # Shared TypeScript types
│   │   └── utils/              # Utility functions
│   │
│   ├── config/                 # Configuration files
│   │   └── env/               # Environment variables setup
│   │
│   ├── styles/                 # Global styles and CSS
│   ├── middleware.ts           # Next.js middleware (auth)
│   └── instrumentation.ts      # Sentry instrumentation
│
├── tests/                      # Test configuration and utilities
├── cypress/                    # End-to-end tests
├── docs/                       # Technical documentation
└── public/                     # Static assets
```

### **Architecture Principles**

- **Feature-based modules**: Authentication and dashboard are separate modules with their own components, services, and types
- **Shared utilities**: Common functionality is centralized in the `shared/` directory
- **Route groups**: Next.js route groups organize pages by access level (auth vs private)
- **Data Access Layer**: Server-side authentication validation through `shared/libs/dal/`
- **Provider pattern**: React context providers manage global state (auth, query client)
- **Component co-location**: Related components are grouped by feature or purpose

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

## Key Features & Architecture Decisions

### **Data Access Layer (DAL)**

The DAL provides server-side authentication validation with strong security patterns:

- **Server-only execution**: Ensures authentication logic never runs on client
- **Cookie-based sessions**: Secure HttpOnly JWT token management
- **Type-safe interfaces**: Strong TypeScript definitions for user and session data
- **Error handling**: Graceful degradation for invalid or expired sessions
- **Sentry integration**: Comprehensive error tracking and monitoring

**Key DAL Functions:**
- `verifySession()` - Validates JWT tokens from HttpOnly cookies
- `getUser()` - Retrieves authenticated user data
- `createSession()` - Establishes new user sessions
- **Location**: `src/shared/libs/dal/`

### **Authentication Module**

Enterprise-grade authentication with security-first design:

- **HttpOnly cookies**: JWT tokens stored securely, inaccessible to JavaScript
- **CSRF protection**: SameSite=Strict cookie configuration
- **Automatic refresh**: Transparent token renewal without user intervention
- **Protected routes**: Server-side validation for dashboard access
- **Error boundaries**: Graceful handling of authentication failures

### **Dashboard Module**

Server-side rendered protected dashboard with performance optimization:

- **SSR protection**: Routes validated server-side before rendering
- **React Query integration**: Efficient client-side data fetching and caching
- **Loading states**: Smooth user experience with skeleton components
- **Error handling**: User-friendly error messages and retry mechanisms

### **Observability & Monitoring**

Comprehensive monitoring setup with Sentry integration:

- **Error tracking**: Client and server-side error capture
- **Performance monitoring**: Core Web Vitals and runtime metrics
- **User context**: Enhanced debugging with user session data
- **Breadcrumbs**: Detailed activity tracking for issue reproduction

## Contributing

When making architectural changes:

1. Create ADR first
2. Get peer review
3. Implement with tests
4. Update decision log
5. Mark ADR as implemented

---

_Last updated: September 2025_
