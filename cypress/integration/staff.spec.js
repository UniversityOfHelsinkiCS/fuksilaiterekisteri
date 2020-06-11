/// <reference types="Cypress" />

context('Staff', () => {
  beforeEach(() => {
    cy.createUser("non_fuksi_student")
  
    cy.login("admin")
    cy.visit("/")
    cy.contains('non-fuksiEtunimi').parent().parent().find('.refresh').eq(0).click()

    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.contains('FUKSILAITTEET')
  })

  it('Redirects staff to the correct page', () => {
    cy.contains('Sinulla on oikeus seuraaviin opinto-ohjelmiin:')
    cy.contains('Tietojenkäsittelytieteen kandiohjelma (KH50_005)')
    cy.contains('non-fuksiEtunimi non-fuksi')
  })
})
