<div align="center">

# 🔐 SecureOBS Dashboard

**Secure & Observable Web Application built with Next.js 15**

[![Build Status](https://img.shields.io/github/actions/workflow/status/username/nextjs-secure-obs/ci.yml?branch=main&style=for-the-badge)](https://github.com/username/nextjs-secure-obs/actions)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen?style=for-the-badge)](#)
[![Lint](https://img.shields.io/badge/lint-passing-brightgreen?style=for-the-badge)](#)
[![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen?style=for-the-badge)](#)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![React Query](https://img.shields.io/badge/React_Query-5.0-FF4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query)
[![Sentry](https://img.shields.io/badge/Sentry-Integration-362D59?style=for-the-badge&logo=sentry)](https://sentry.io/)

![alt text](nextjs-authflow.png)

</div>

## 🇧🇷 Sobre o Projeto

Este projeto demonstra a construção de uma aplicação web segura e observável utilizando Next.js 15, com autenticação baseada em cookies HttpOnly, dashboard protegido via SSR e integração completa com Sentry para monitoramento de erros e performance. O foco está em padrões de segurança enterprise e arquitetura bem documentada através de RFCs e ADRs.

## Overview

SecureOBS Dashboard is a production-ready secure member area that showcases enterprise-grade patterns for authentication, authorization, and observability in modern React applications. Built with Next.js 15 App Router, it demonstrates security-first architecture with comprehensive error tracking and performance monitoring.

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔐 **Security First**

- JWT authentication via HttpOnly cookies
- CSRF protection with SameSite=Strict
- Server-side session validation
- Protected SSR routes with redirect handling

</td>
<td width="50%">

### 📊 **Observability**

- Client & server error tracking with Sentry
- Performance monitoring and Core Web Vitals
- Authentication flow analytics
- Comprehensive error boundaries

</td>
</tr>
<tr>
<td width="50%">

### ⚡ **Performance**

- Server-side rendered protected dashboard
- React Query for efficient data fetching
- Automatic token refresh with retry logic
- Optimized bundle with code splitting

</td>
<td width="50%">

### ♿ **Accessibility**

- WCAG 2.1 AA compliance
- Screen reader support with live regions
- Keyboard navigation and skip links
- High contrast and reduced motion support

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and yarn
- Modern browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/username/nextjs-secure-obs.git
cd nextjs-secure-obs

# Copy environment variables
cp .env.example .env

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) and login with:

- **Email**: `teste@email.com`
- **Password**: `123456`

## 📜 Available Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `yarn dev`          | Start development server with Turbopack |
| `yarn build`        | Build the application for production    |
| `yarn start`        | Start the production server             |
| `yarn lint`         | Run ESLint for code quality             |
| `yarn lint:fix`     | Run ESLint and fix issues automatically |
| `yarn typecheck`    | Run TypeScript type checking            |
| `yarn format`       | Format code with Prettier               |
| `yarn format:check` | Check code formatting with Prettier     |

### 🧪 Testing Scripts

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `yarn test`           | Run unit tests with Jest                      |
| `yarn test:watch`     | Run unit tests in watch mode                  |
| `yarn test:coverage`  | Run unit tests with coverage report           |
| `yarn test:server`    | Run server-side unit tests only               |
| `yarn test:client`    | Run client-side unit tests only               |
| `yarn e2e`            | Run end-to-end tests with Cypress             |
| `yarn e2e:open`       | Open Cypress interactive test runner          |
| `yarn e2e:ci`         | Run end-to-end tests in headless mode         |
| `yarn test:e2e`       | Start dev server and run e2e tests            |

## 🛠 Tech Highlights

### **Core Technologies**

- **Next.js 15** with App Router and Server Components
- **TypeScript 5.0** for type safety across the stack
- **React Query** for client-side state management
- **Tailwind CSS** + **shadcn/ui** for modern styling

### **Security & Authentication**

- **JWT tokens** stored in HttpOnly cookies with proper flags
- **Server-side session validation** using Data Access Layer (DAL)
- **CSRF protection** via SameSite=Strict cookies
- **Automatic token refresh** with transparent user experience

### **Observability & Monitoring**

- **Sentry integration** for client and server error tracking
- **Performance monitoring** with Core Web Vitals tracking
- **Error boundaries** with user-friendly fallbacks
- **Breadcrumbs and context** for enhanced debugging

### **Development Experience**

- **Route Handlers** for realistic API mocks
- **Error simulation** for testing observability tools
- **Comprehensive testing** with Jest and React Testing Library
- **Accessibility testing** with axe-core integration

## 🧪 Testing

This project includes comprehensive testing setup for both unit and end-to-end testing:

### **Unit Testing (Jest)**

- **Jest** with TypeScript support and JSDOM environment
- **React Testing Library** for component testing
- **MSW** for API mocking during tests
- **Coverage reporting** with detailed metrics
- **Separate test suites** for client and server code

**Running Tests:**
```bash
# Run all unit tests
yarn test

# Run tests in watch mode during development
yarn test:watch

# Generate coverage report
yarn test:coverage

# Run only server-side tests
yarn test:server

# Run only client-side tests
yarn test:client
```

### **End-to-End Testing (Cypress)**

- **Cypress** for comprehensive E2E testing
- **Authentication flow testing** with real login scenarios
- **Dashboard functionality** testing with protected routes
- **Cross-browser compatibility** testing

**Running E2E Tests:**
```bash
# Run E2E tests headlessly
yarn e2e

# Open Cypress interactive runner
yarn e2e:open

# Run E2E tests in CI mode
yarn e2e:ci

# Start dev server and run E2E tests
yarn test:e2e
```

### **Test Structure**

```
├── __tests__/              # Unit tests
│   ├── components/         # Component tests
│   ├── lib/               # Utility function tests
│   └── app/               # Page and API tests
├── cypress/               # E2E tests
│   ├── e2e/              # Test scenarios
│   ├── fixtures/         # Test data
│   └── support/          # Helper functions
└── jest.config.js        # Jest configuration
```

## 📚 Documentation

Our technical documentation follows RFC/ADR patterns for architectural decisions:

- **[📖 Technical Overview](docs/README.md)** - Complete project documentation
- **[📋 Decision Log](docs/decisions/decisions-log.md)** - Chronological record of all decisions
- **[📐 RFC 0001](docs/decisions/rfc/0001-secure-member-area-mvp.md)** - Architecture proposal and requirements
- **[🏗️ Architecture Decision Records](docs/decisions/adr/)** - Detailed technical decisions

### Key ADRs

- [Auth Storage: HttpOnly Cookies](docs/decisions/adr/0001-auth-storage-httpOnly-cookies.md)
- [Protected SSR Dashboard Pattern](docs/decisions/adr/0002-protected-ssr-dashboard-middleware-vs-handler.md)
- [Client Authentication Fetch](docs/decisions/adr/0003-client-fetch-auth-pattern.md)
- [Sentry Observability Setup](docs/decisions/adr/0005-sentry-observability-setup.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using Next.js 15 and modern web standards**

[Report Bug](https://github.com/username/nextjs-secure-obs/issues) • [Request Feature](https://github.com/username/nextjs-secure-obs/issues) • [View Docs](docs/README.md)

</div>
