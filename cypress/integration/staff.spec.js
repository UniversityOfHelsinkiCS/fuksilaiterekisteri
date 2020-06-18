/// <reference types="Cypress" />

context('Staff', () => {
  beforeEach(() => {
    cy.createUser("non_fuksi_student")
  
    cy.login("admin")
    cy.visit("/")
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy=toggleStaff]').click()

    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.contains('FUKSILAITTEET')
  })

  it('Redirects staff to the correct page', () => {
    cy.contains('Sinulla on oikeus seuraaviin opinto-ohjelmiin:')
    cy.contains('Tietojenkäsittelytieteen kandiohjelma (KH50_005)')
    cy.contains('non-fuksiEtunimi non-fuksi')
  })

  it.only("Can use filters and nothing breaks", () => {
    cy.visit("/")
    cy.get('[data-cy=deviceHolders-filter]').click()
    cy.get('[data-cy=currentYearEligible-filter]').click()
  })
})
