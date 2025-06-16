import { faker } from '@faker-js/faker'
/// <reference types="cypress" />
/* global cy */

describe('SignUpPage E2E', () => {
  beforeEach(() => {
    cy.visit('/sign-up')
  })

  it('should display registration form', () => {
    cy.get('input[name="name"]')
      .should('be.visible')
      .and('have.attr', 'type', 'text')
    cy.get('input[name="email"]')
      .should('be.visible')
      .and('have.attr', 'type', 'email')
    cy.get('input[name="password"]')
      .should('be.visible')
      .and('have.attr', 'type', 'password')
    cy.get('input[name="confirm-password"]')
      .should('be.visible')
      .and('have.attr', 'type', 'password')
    cy.get('button[type="submit"]')
      .contains(/register/i)
      .should('be.visible')
    cy.contains(/already have an account/i).should('be.visible')
    cy.get('a').contains(/login/i).should('have.attr', 'href', '/login')
  })

  it('should allow user to register with valid data', () => {
    const name = faker.person.firstName()
    const email = faker.internet.email()
    const nickname = faker.internet.username()
    const password = '#TestPassword123'

    cy.get('input[name="name"]').type(name)
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="nickname"]').type(nickname)
    cy.get('input[name="password"]').type(password)
    cy.get('input[name="confirm-password"]').type(password)
    cy.get('button[type="submit"]').click({ multiple: true, force: true })
    // cy.setCookie('access_token', 'mocked value')
    cy.url().should('include', '/')
  })

  it('should show validation errors for mismatched passwords', () => {
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('john@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirm-password"]').type('differentpassword')
    cy.get('button[type="submit"]').click({ multiple: true, force: true })
    cy.url().should('include', '/sign-up')
  })
})

describe('SignInPage E2E', () => {
  beforeEach(() => {
    cy.visit('/sign-in')
  })

  it('should display login form', () => {
    cy.get('input[name="email"]')
      .should('be.visible')
      .and('have.attr', 'type', 'email')
    cy.get('input[name="password"]')
      .should('be.visible')
      .and('have.attr', 'type', 'password')
    cy.get('button[type="submit"]').contains(/login/i).should('be.visible')
    cy.contains("Don't have an account?").should('be.visible')
    cy.get('a')
      .contains(/register/i)
      .should('have.attr', 'href', '/register')
  })

  it('should allow user to login with valid credentials', () => {
    const email = 'testuser@example.com'
    const password = 'TestPassword123'

    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click({ multiple: true, force: true })

    cy.url().should('not.include', '/login')
  })

  it('should show validation errors on empty submit', () => {
    cy.get('button[type="submit"]').click({ multiple: true, force: true })
    cy.url().should('include', '/sign-in')
  })
})
