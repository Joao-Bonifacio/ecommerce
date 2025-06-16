/// <reference types="cypress" />
/* global cy */

describe('SellerPannel E2E', () => {
  beforeEach(() => {
    cy.setCookie('access_token', 'mocked-token-value')
    cy.visit('/seller')
  })

  it('should display list of products with stock and description', () => {
    cy.get('h4')
      .contains(/list - \(\d+\)/i)
      .should('be.visible')

    cy.get('ul.list-none > li').each(($el) => {
      cy.wrap($el).within(() => {
        cy.get('h5').should('be.visible')
        cy.get('p').should('be.visible')
        cy.get('img[alt="product-image"]').should('be.visible')
      })
    })
  })

  it('should display total sales and total earnings', () => {
    cy.get('h4')
      .contains(/sales - \(\d+\)/i)
      .should('be.visible')
    cy.get('h4 span.text-right')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.match(/^\$\d{1,3}(,\d{3})*(\.\d{2})?$/)
      })
  })

  it('should display products sorted by sales in sales list', () => {
    cy.get('div.flex-1\\/2.p-5 ul > li').then(($items) => {
      const salesValues: number[] = []

      $items.each((_, el) => {
        const text = (el.querySelector('span')?.textContent ?? '').trim()
        const match = text.match(/\((\d+)\)$/)
        if (match) salesValues.push(Number(match[1]))
      })

      const sorted = [...salesValues].sort((a, b) => b - a)
      expect(salesValues).to.deep.equal(sorted)
    })
  })

  it('should allow clicking AddProduct button', () => {
    cy.get('button')
      .contains(/add product/i)
      .click({ multiple: true, force: true })
  })
})
