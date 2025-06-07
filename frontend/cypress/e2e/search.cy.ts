/* eslint-disable no-undef */
describe('seach products', () => {
  it('should search for a products', () => {
    cy.searchByQuery('product')
    cy.location('pathname').should('include', '/search')
    cy.location('search').should('include', 'q=product')
    cy.get('a[href^="/product"]').should('exist')
  })

  it('should not to be able to visit search page without a search query', () => {
    cy.on('uncaught:exception', () => false)
    cy.visit('/search', { failOnStatusCode: false })
    cy.location('pathname').should('equal', '/')
  })
})
