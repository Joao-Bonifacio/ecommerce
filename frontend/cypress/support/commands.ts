/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-undef */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    searchByQuery(query: string): Chainable<void>
  }
}

Cypress.Commands.add('searchByQuery', (query: string) => {
  cy.visit('/', { failOnStatusCode: false })
  cy.get('input[name=q]').type(query).parent('form').submit()
})
