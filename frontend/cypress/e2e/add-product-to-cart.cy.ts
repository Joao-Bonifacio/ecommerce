/* eslint-disable no-undef */
describe('add product to cart', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('should be able to navigate to the product page and add it to cart', () => {
    cy.get('a[href^="/product"]').first().click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Cart (0)').should('exist')
    cy.contains('Add to cart').click()
    cy.contains('Cart (1)').should('exist')
  })

  it('should not count duplicated products on cart', () => {
    cy.get('a[href^="/product"]').first().click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Cart (0)').should('exist')
    cy.contains('Add to cart').click()
    cy.contains('Add to cart').click()
    cy.contains('Cart (1)').should('exist')
  })

  it('should search for a product and add it to the cart', () => {
    cy.searchByQuery('product')
    cy.get('a[href^="/product"]').first().click()
    cy.location('pathname').should('include', '/product')
    cy.contains('Add to cart').click()
    cy.contains('Cart (1)').should('exist')
  })
})
