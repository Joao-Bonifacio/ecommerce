/// <reference types="cypress" />
/* global cy */

describe('Rate Product Flow', () => {
  beforeEach(() => {
    cy.setCookie('access_token', 'mock_token')
    cy.visit('/')
    cy.get('a[href^="/product"]').first().as('firstProductLink')
    cy.contains(/^Cart \(\d+\)$/).as('cartCounter')
  })

  it('should open rate product dialog and submit a rating', () => {
    cy.get('@firstProductLink').click()
    cy.contains('button', 'Rate this product').click()
    cy.contains('Rate this product').should('be.visible')

    cy.get('input[name="title"]').type('Great product')
    cy.get('input[name="description"]').type('Really enjoyed using it.')
    cy.get('input[name="stars"]').clear().type('5')

    cy.get('button[type="submit"]')
      .contains(/save changes/i)
      .click({ multiple: true, force: true })
  })
})
