/// <reference types="Cypress" />

describe('Student', () => {
  beforeEach(() => {
    cy.login("fuksi")
  })

  it('doesnt allow eligible students to proceed without accepting terms', () => {
    cy.get('[data-cy=otherEmailInput]').type('fuksi@fuksi.fuksi')
    
    cy.get('[data-cy=getDevicePrimary]').should('have.class', 'disabled')
    cy.get('[data-cy=getDeviceSecondary]').should('have.class', 'disabled')
  })

  it('allows eligible students to sign up with email AND localization works', () => {
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=closeTerms]').click()
    cy.get('[data-cy=acceptTerms]').click()

    cy.get('button').should('have.class', 'disabled')
    cy.get('[data-cy=otherEmailInput]').type('fuksi@helsinki.fi')
    cy.get('button').should('have.class', 'disabled')
    cy.get('input').eq(0).clear()

    cy.get('[data-cy=otherEmailInput]').type('fuksi@fuksi.fuksi')
    cy.get('button').should('not.have.class', 'disabled')
    cy.get('[data-cy=getDevicePrimary]').click()
    cy.contains('Tehtävien tila:')

    cy.contains("tietokoneen tekniset tiedot")
    cy.get("[data-cy=setlocale-en]").click()
    cy.contains("The laptop")
    cy.contains("tietokoneen tekniset tiedot").should("not.exist")   

  })

  it('allows eligible students to sign up without email', () => {
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=closeTerms]').click()
    cy.get('[data-cy=acceptTerms]').click()

    cy.get('[data-cy=getDeviceSecondary]').click()
    cy.contains('Tehtävien tila:')
  })

  it("non eligible students see why they are not eligible", () => {
    cy.login("non_fuksi_student")
    cy.get('[data-cy=notEligible]')

    cy.get(".green").eq(2)
    cy.get(".red").eq(0)

  })

  it("doesn't allow non-students to sign up", () => {
    cy.login("irrelevant_staff")
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

  it("sees message if does not have studentnumber ready yet", () => {
    cy.login("fuksi_without_studentnumber")
    cy.get("[data-cy=no-student-number-error]")
  })
})

describe("Previous years student", () => {
  it("cant request device after 'fuksiyear' even if was marked eligible last year", () => {
    cy.createUser("fuksi")
    cy.request("/api/test/advance")
    cy.visit("/")
    cy.get('[data-cy=notEligible]')
  })
})