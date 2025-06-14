/* eslint-disable no-undef */
describe('add product to cart', () => {
  beforeEach(() => {
    // cy.setCookie('access_token', 'mocked-token-value')
    cy.visit('/')
    cy.get('a[href^="/product"]').first().as('firstProductLink')
    cy.contains(/^Cart \(\d+\)$/).as('cartCounter')
  })

  it('should be able to navigate to the product page and add it to cart', () => {
    cy.get('@firstProductLink').click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Add to cart').should('be.visible').click()
    cy.get('@cartCounter').should('contain.text', 'Cart (1)')
  })

  it('should not count duplicated products on cart', () => {
    cy.get('@firstProductLink').click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Add to cart').as('addToCartButton')
    cy.get('@cartCounter').should('contain.text', 'Cart (0)')
    cy.get('@addToCartButton').click()
    cy.get('@addToCartButton').click()
    cy.get('@cartCounter').should('contain.text', 'Cart (1)')
  })

  it('should search for a product and add it to the cart', () => {
    cy.searchByQuery('product')
    cy.get('a[href^="/product"]').first().click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Add to cart').as('addToCartButton')
    cy.get('@addToCartButton').click()
    cy.get('@cartCounter').should('contain.text', 'Cart (1)')
  })
})
