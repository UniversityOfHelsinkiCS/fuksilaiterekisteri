/// <reference types="Cypress" />

context('Student', () => {
  beforeEach(() => {
    cy.login("fuksi")
    cy.visit('/')
  })

  it('allows eligible students to sign up with email', () => {
    cy.get('button').should('have.class', 'disabled')
    cy.get('input').type('fuksi@helsinki.fi')
    cy.get('button').should('have.class', 'disabled')
    cy.get('input').clear()

    cy.get('input').type('fuksi@fuksi.fuksi')
    cy.get('button').should('not.have.class', 'disabled')
    cy.contains('I want a device').click()
    cy.contains('Task status:')
  })

  it('allows eligible students to sign up without email', () => {
    cy.contains('I want a device, but').click()
    cy.contains('Task status:')
  })

  it("doesn't allow non-eligible students to sign up", () => {
    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.contains('Unfortunately you are not eligible for the fresher device.')
  })

  it("doesn't allow non-students to sign up", () => {
    cy.login("irrelevant_staff")
    cy.visit("/")
    cy.contains('FUKSILAITTEET')
    cy.contains('Hei, sinulla ei ole oikeuksia fuksilaite-palveluun. Ota yhteyttä grp-toska@helsinki.fi jos sinulla kuuluisi olla oikeudet.')
    cy.visit('/student')
    cy.location('pathname').should('eq', '/unauthorized')
    cy.contains('Hei, sinulla ei ole oikeuksia fuksilaite-palveluun. Ota yhteyttä grp-toska@helsinki.fi jos sinulla kuuluisi olla oikeudet.')
  })

  it("doesn't allow students to see admin or distributor page", () => {
    cy.visit('/admin')
    cy.location('pathname').should('eq', '/student')
    cy.visit('/distributor')
    cy.location('pathname').should('eq', '/student')
  })
})
