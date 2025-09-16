# Cypress E2E Testing

This directory contains end-to-end tests for the authentication flow using Cypress.

## Structure

```
cypress/
├── e2e/
│   └── auth-flow.cy.ts     # Main authentication flow tests
├── fixtures/
│   └── user.json           # Test data (credentials)
├── support/
│   ├── commands.ts         # Custom Cypress commands
│   ├── component.ts        # Component testing support (disabled)
│   └── e2e.ts             # E2E test configuration
└── README.md              # This file
```

## Test Credentials

The tests use hardcoded credentials that match the API mock:
- **Email**: `teste@email.com`
- **Password**: `123456`

## Custom Commands

### `cy.login(email?, password?)`
Performs a complete login flow with optional custom credentials.

```typescript
cy.login() // Uses default test credentials
cy.login('custom@email.com', 'password') // Uses custom credentials
```

### `cy.shouldBeOnDashboard()`
Verifies that the user is on the dashboard page.

```typescript
cy.shouldBeOnDashboard()
```

### `cy.shouldBeOnLogin()`
Verifies that the user is on the login page.

```typescript
cy.shouldBeOnLogin()
```

## Data Attributes

Tests use `data-cy` attributes for reliable element selection:

- `data-cy="login-form"` - Login form container
- `data-cy="email-input"` - Email input field
- `data-cy="password-input"` - Password input field
- `data-cy="login-submit"` - Submit button
- `data-cy="dashboard-main"` - Dashboard main content

## Running Tests

```bash
# Open Cypress Test Runner (recommended for development)
npm run e2e:open

# Run tests headlessly (CI mode)
npm run e2e

# Run with specific browser
npx cypress run --browser chrome

# Run specific test file
npx cypress run --spec "cypress/e2e/auth-flow.cy.ts"
```

## Test Scenarios

### Authentication Flow Tests (`auth-flow.cy.ts`)

1. **Successful Login**: Complete flow from login page to dashboard
2. **Failed Login**: Invalid credentials should show error and stay on login
3. **Protected Route**: Accessing dashboard without auth redirects to login
4. **Custom Commands**: Verify custom login command works correctly
5. **Session Persistence**: Session should persist across page refreshes
6. **API Testing**: Validates the `/api/auth/login` endpoint responses

## Best Practices

- **Clear state**: Each test clears cookies, localStorage, and sessionStorage
- **Data attributes**: Use `data-cy` instead of CSS classes or IDs
- **API interception**: Monitor and validate API calls during tests
- **Descriptive assertions**: Use meaningful assertion messages
- **Isolated tests**: Each test should work independently

## Configuration

The main configuration is in `cypress.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Viewport**: 1280x720
- **Timeouts**: 10 seconds for commands, requests, and responses
- **Video**: Disabled for faster runs
- **Screenshots**: Enabled on test failures

## Debugging

- Use `cy.debug()` to pause test execution
- Use `cy.pause()` to pause and inspect the application state
- Check the Cypress Test Runner for detailed logs and DOM snapshots
- Enable video recording by setting `video: true` in config for CI debugging