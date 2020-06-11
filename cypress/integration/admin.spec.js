/// <reference types="Cypress" />

context('Admin', () => {

  beforeEach(() => {
    cy.createUser("non_fuksi_student")
    cy.login("admin")
    cy.visit('/')
  })

  it('Redirects admin to the correct page', () => {
    cy.contains('admin')
    cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 2)
  })

  it('Can mark student eligible', () => {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('Some text')
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Mark eligible)').click()
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 3)
    })
  })

  it('Can toggle user roles', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('.refresh').eq(0).click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 3)
    cy.contains('non-fuksiEtunimi').parent().parent().find('.refresh').eq(1).click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 4)

    cy.contains('non-fuksiEtunimi').parent().parent().find('.refresh').eq(0).click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 3)
    cy.contains('non-fuksiEtunimi').parent().parent().find('.refresh').eq(1).click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 2)
  })

  // Only fails in ci. Gonna fix later
   it.skip('Can save admin note for user', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('.sticky').click()
    cy.contains('Edit admin note for user non-fuksiEtunimi non-fuksi')
    cy.get('textarea').type('test123')
    cy.contains('Peruuta').click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('.sticky').click()
    cy.contains('Edit admin note for user non-fuksiEtunimi non-fuksi')
    cy.contains('test123').should('not.exist')
    cy.get('textarea').type('test123')
    cy.contains('Tallenna').click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('.sticky').click()
    cy.contains('Edit admin note for user non-fuksiEtunimi non-fuksi')
    cy.contains('test123')
  })
})
