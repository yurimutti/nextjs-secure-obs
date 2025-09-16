/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      shouldBeOnDashboard(): Chainable<void>
      shouldBeOnLogin(): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email = 'teste@email.com', password = '123456') => {
  cy.visit('/login')
  cy.get('[data-cy=email-input]').type(email)
  cy.get('[data-cy=password-input]').type(password)
  cy.get('[data-cy=login-submit]').click()
})

Cypress.Commands.add('shouldBeOnDashboard', () => {
  cy.url().should('include', '/dashboard')
  cy.get('[data-cy=dashboard-main]').should('be.visible')
})

Cypress.Commands.add('shouldBeOnLogin', () => {
  cy.url().should('include', '/login')
  cy.get('[data-cy=login-form]').should('be.visible')
})

export {}