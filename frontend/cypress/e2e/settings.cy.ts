/// <reference types="cypress" />
/* global cy */
import 'cypress-file-upload'

describe('Settings Page E2E', () => {
  beforeEach(() => {
    cy.setCookie('access_token', 'mocked-token-value')
    cy.visit('/settings')
  })

  it('should open avatar edit dialog and submit new avatar', () => {
    cy.get('img[id="editAvatar"]').click({ multiple: true })
    cy.contains('Edit avatar').should('be.visible')
    cy.get('input[name="fileName"]').clear().type('new-avatar')

    const fileName = 'sample.jpeg'
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
        mimeType: 'image/jpeg',
        encoding: 'base64',
      })
    })

    cy.get('button')
      .contains(/save changes/i)
      .click()
  })

  it('should update password successfully', () => {
    cy.get('input[placeholder="Current Password"]').type('OldPassword123')
    cy.get('input[placeholder="New Password"]').type('NewPassword123')
    cy.get('button[type="submit"]')
      .contains(/save password/i)
      .click()
  })

  it('should display upgrade plan button if user level is not PLATINUM', () => {
    cy.get('button')
      .contains(/upgrade plan/i)
      .should('be.visible')
  })
})
