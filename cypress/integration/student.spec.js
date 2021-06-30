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

  it('updates eligibility on login', () => {
    cy.get('[data-cy=terms]')
    cy.login('admin')
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('Some text')
      cy.contains('fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Mark ineligible)').click()
      cy.contains('fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 0)
    })

    cy.login('fuksi')
    cy.get('[data-cy=terms]')
  })

  // Change this if digi-100a task is enabled
  it('updates task statuses on login', () => {
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=closeTerms]').click()
    cy.get('[data-cy=acceptTerms]').click()
    cy.get('[data-cy=getDeviceSecondary]').click()
    cy.get(".checkmark").its('length').should('eq', 1)

    cy.login('admin')
    cy.contains('fuksiEtunimi').parent().parent().find('[data-cy="toggleDigiskills"]').click()
    cy.contains('fuksiEtunimi').parent().parent().find('[data-cy="toggleDigiskills"]').should("not.have.class","checked")

    cy.login('fuksi')
    cy.get(".checkmark").its('length').should('eq', 1)
  })

  // Change this if digi-100a task is enabled
  it('does not update task statuses that are true', () => {
    cy.login('fuksi_without_digiskills')
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=closeTerms]').click()
    cy.get('[data-cy=acceptTerms]').click()
    cy.get('[data-cy=getDeviceSecondary]').click()
    cy.get(".checkmark").its('length').should('eq', 1)

    cy.login('admin')
    cy.contains('fuksiWithoutDigi').parent().parent().find('[data-cy="toggleDigiskills"]').click()
    cy.contains('fuksiWithoutDigi').parent().parent().find('[data-cy="toggleDigiskills"]').should("have.class","checked")

    cy.login('fuksi_without_digiskills')
    cy.get(".checkmark").its('length').should('eq', 1)
  })

  it("non eligible students see why they are not eligible", () => {
    cy.login("non_fuksi_student")
    cy.get('[data-cy=notEligible]')

    cy.get(".green").its('length').should('eq', 2)
    cy.get(".red").its('length').should('eq', 1)

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

  it('updates sign up year on login if would be eligble this year', () => {
    cy.createCustomUser({
      userId: 'eligible2',
      name: 'eligible lastYear',
      studentNumber: 'eligible2',
      signUpYear: 2018,
      eligible: true,
      wantsDevice: false,
    })

    cy.login('admin')
    cy.contains('Current years eligible students').click()
    cy.should('not.contain', 'eligible1')

    cy.login('eligible2')
    cy.get('[data-cy=terms]')

    cy.login('admin')
    cy.contains('Current years eligible students').click()
    cy.contains('eligible2')
  })
})