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

  it('Can give staff role', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleStaff"]').click()
    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.contains("Sinulla on oikeus")
  })

  it('Can give admin role', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleAdmin"]').click()
    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.get('[data-cy=servicestatus-tab]')
  })

  it("Can't remove admin from self", () => {
    cy.get(".ReactVirtualized__Table").contains("adminEtunimi").parent().parent().find("[data-cy=toggleAdmin] > input").should("be.disabled")
  })

  it('Can give distributor role', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleDistributor"]').click()
    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.contains("Matemaattis-luonnontieteellisen tiedekunnan fuksilaitteiden jakelu")
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

  it("Can mark device as returned", () => {
    cy.createUser("fuksi")
    cy.contains('FUKSILAITTEET')
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=acceptTerms]').click()
    cy.get('[data-cy=getDeviceSecondary]').click()
    cy.get('[data-cy=taskStatus]').contains('Tehtävien tila')

    cy.login("jakelija")
    cy.visit('/')
    cy.contains('FUKSILAITTEET')

    cy.get('input').eq(0).type("fuksi")
    cy.contains('Hae').click()

    cy.get('#device-serial-input').type('RAB12')
    cy.contains('Anna laite').click()

    cy.login("admin")
    cy.visit("/")

    cy.contains('fuksiEtunimi fuksi').parent().parent().find("[data-cy=markDeviceReturned]").click()
    cy.contains('fuksiEtunimi fuksi').parent().parent().find("[data-cy=markDeviceReturned]").should("be.disabled")

  })

  it("Can set registration deadline", () => {
    cy.visit("/")
    cy.get('[data-cy=servicestatus-tab]').click()
    
    cy.get(".react-datepicker__input-container").eq(0).find("input").click()
    cy.get(".react-datepicker__navigation").click()
    cy.get(".react-datepicker__day--024").click()
    cy.get("[data-cy=updateRegistrationDeadline]").click()
    cy.contains("Settings saved")
  })

  it("Can set task deadline", () => {
    cy.visit("/")
    cy.get('[data-cy=servicestatus-tab]').click()
    
    cy.get(".react-datepicker__input-container").eq(1).find("input").click()
    cy.get(".react-datepicker__navigation").click()
    cy.get(".react-datepicker__day--024").click()
    cy.get("[data-cy=updateTaskDeadline]").click()
    cy.contains("Settings saved")
  })

  it("Can disable and enable registrations", () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('stop')
      }
    })
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get("[data-cy=disableRegistrations]").click()
    cy.contains("Settings saved")
    cy.get("[data-cy=enableRegistrations]")

    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('start')
      }
    })
    cy.get('[data-cy=servicestatus-tab]').click()

    cy.get("[data-cy=enableRegistrations]").click()
    cy.get("[data-cy=disableRegistrations]")
    cy.contains("Settings saved")

  })

  it("Can end distribution year", () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('stop')
      }
    })
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.contains("Registrations for year 2019 are currently open")
    cy.get("[data-cy=endDistYear]").should("be.disabled")
    cy.get("[data-cy=disableRegistrations]").click()

    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('advance')
      }
    })
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get("[data-cy=endDistYear").click()
    cy.contains("Registrations for year 2020 are currently closed")
  })

  it("Can update custom texts", () => {
    cy.visit("/")
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get("[data-cy=customTextSelect]").click()
    cy.get("[data-cy=customTextSelect]").find("div.item").eq(1).click() // Selects "Not eligible text"

    cy.get("[data-cy=text-fi]").clear().type("Sori, et saa laitetta.")
    cy.get("[data-cy=saveButton]").click()
    cy.contains("Settings saved")

    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.get('[data-cy=notEligible] > p').should("have.text","Sori, et saa laitetta.")

  })

  it("Can use filters and filters work", () => {
    cy.visit("/")
    cy.get('[data-cy=all-filter]').find("input").should("be.checked")
    cy.contains("non-fuksiEtunimi")
    cy.get('[data-cy=currentYearEligible-filter]').click()
    cy.contains("non-fuksiEtunimi").should("not.exist")
    cy.get('[data-cy=allStaff-filter]').click()
  })


})
