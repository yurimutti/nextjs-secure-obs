describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('should complete login flow from login page to dashboard', () => {
    cy.visit('/login')

    cy.shouldBeOnLogin()

    cy.get('[data-cy=email-input]').type('teste@email.com')
    cy.get('[data-cy=password-input]').type('123456')

    cy.get('[data-cy=login-submit]').click()

    cy.shouldBeOnDashboard()

    cy.contains('Welcome to your member area').should('be.visible')
    cy.contains('Active Member').should('be.visible')
    cy.contains('Your Profile').should('be.visible')
  })

  it('should fail login with invalid credentials', () => {
    cy.visit('/login')

    cy.get('[data-cy=email-input]').type('invalid@email.com')
    cy.get('[data-cy=password-input]').type('wrongpassword')

    cy.get('[data-cy=login-submit]').click()

    cy.shouldBeOnLogin()
    cy.contains('Authentication failed').should('be.visible')
  })

  it('should redirect to login when accessing protected route without auth', () => {
    cy.visit('/dashboard')

    cy.shouldBeOnLogin()
  })

  it('should use custom login command', () => {
    cy.login()

    cy.shouldBeOnDashboard()
  })

  it('should maintain session across page refreshes', () => {
    cy.login()
    cy.shouldBeOnDashboard()

    cy.reload()

    cy.shouldBeOnDashboard()
  })

  it('should handle API endpoint correctly', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'teste@email.com',
        password: '123456'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('message', 'ok')
      expect(response.body).to.have.property('accessToken')
      expect(response.body).to.have.property('refreshToken')
    })

    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      failOnStatusCode: false,
      body: {
        email: 'invalid@email.com',
        password: 'wrongpassword'
      }
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('message', 'Invalid credentials')
    })
  })
})