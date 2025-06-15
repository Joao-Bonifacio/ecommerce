/// <reference types="cypress" />
/* global cy */

describe('Shopping Cart Flow', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('a[href^="/product"]').first().as('firstProductLink')
    cy.contains(/^Cart \(\d+\)$/).as('cartCounter')
  })
  it('should allow user to add products to cart and view cart', () => {
    cy.get('@firstProductLink').click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Add to cart').should('be.visible').click()
    cy.get('@cartCounter').should('contain.text', 'Cart (1)')
    cy.get('a[href^="/cart"]').click()
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should allow user to complete checkout flow', () => {
    cy.get('@firstProductLink').click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Add to cart').should('be.visible').click()
    cy.get('@cartCounter').should('contain.text', 'Cart (1)')
    cy.get('a[href^="/cart"]').click()
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub')
    })
    cy.get('button[name="purchase"]').click({ multiple: true, force: true })
    cy.get('@alertStub').should(
      'have.been.calledWith',
      'Checkout not implemented yet',
    )
  })
})
