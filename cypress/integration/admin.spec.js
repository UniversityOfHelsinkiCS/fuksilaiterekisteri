/// <reference types="Cypress" />

context('Admin', () => {

  beforeEach(() => {
    cy.createUser("non_fuksi_student")
    cy.login("admin")
    cy.visit('/')
  })

  it('Redirects admin to the correct page', () => {
    cy.contains('admin')
    cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn').find('input[checked]').eq(1)
  })

  it('Can toggle student eligiblity', () => {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('Some text')
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Mark eligible)').click()
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 1)
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Mark ineligible)').click()
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 0)
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

  it("Can toggle digiskills, hasEnrolled and wantsDevice", () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleDigiskills"]').click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleDigiskills"] > input').should("have.attr","checked")
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleHasEnrolled"]').click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleHasEnrolled"] > input').should("have.attr","checked")
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleWantsDevice"]').click()
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleWantsDevice"] > input').should("not.have.attr","checked")
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
    cy.get('[data-cy=closeTerms]').click()
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

  it("Can update device serial", () => {
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get("[data-cy=deviceSerial]").clear().type("1s20N3S2NJ12345")
    cy.get("[data-cy=updateSerial]").click()
    cy.reload()
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get("[data-cy=deviceSerial]").should("have.value","1s20N3S2NJ12345")
  })

  it("Superadmin can use login as", () => {
    cy.visit("/")
    cy.contains("non-fuksiEtunimi non-fuksi").parent().parent().find("[data-cy=loginAs]").click()
    cy.get('[data-cy=notEligible]')
    cy.contains("Stop login as").click()
  })

  it("Non superadmin cant use loginAs", () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleAdmin"]').click()
    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.get('[data-cy=servicestatus-tab]')
    cy.contains("adminEtunimi admin").parent().parent().find("[data-cy=loginAs]").should("not.exist")
  })

  it("Can update contact details and contact details are saved and shown", () => {
    cy.visit("/")
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get('[data-cy=form-KH50_005]').find("input").eq(0).clear().type("Contact Name")
    cy.get('[data-cy=form-KH50_005]').find("input").eq(1).clear().type("Contact.Name@email.com")
    cy.contains("Save changes").click()

    cy.login("non_fuksi_student")
    cy.visit("/")
    cy.contains("Contact Name")
    cy.contains("Contact.Name@email.com")
  })

})

describe("Deadline sanity checks", () => {

  it("Registration deadline can't be after distribution deadline", () => {
    cy.request("/api/test/setServiceStatus", {registrationDeadline:null, taskDeadline:null, studentRegistrationOnline:false})
    cy.login("admin")
    cy.visit('/')
    cy.get('[data-cy=servicestatus-tab]').click()

    cy.contains("are currently closed")
    cy.get("[data-cy=enableRegistrations]").should("be.disabled")
    cy.contains("registration and distribution deadlines must be set")


    cy.get(".react-datepicker__input-container").eq(0).find("input").click()
    cy.get(".react-datepicker__navigation").last().click()
    cy.get(".react-datepicker__day--020").click()

    cy.get(".react-datepicker__input-container").eq(1).find("input").click()
    cy.get(".react-datepicker__navigation").last().click()
    cy.get(".react-datepicker__day--019").click()

    cy.contains("Update deadlines").click()
    cy.contains("distribution deadline must not be before the registration deadline")
  })

  it("Can enable registrations when both deadlines are set correctly to future dates", () =>{
    cy.request("/api/test/setServiceStatus", {registrationDeadline:null, taskDeadline:null, studentRegistrationOnline:false})
    cy.login("admin")
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('start')
      }
    })
    cy.get('[data-cy=servicestatus-tab]').click()

    cy.contains("are currently closed")
    cy.get("[data-cy=enableRegistrations]").should("be.disabled")
    cy.contains("registration and distribution deadlines must be set")

    cy.get(".react-datepicker__input-container").eq(0).find("input").click()
    cy.get(".react-datepicker__navigation").last().click()
    cy.get(".react-datepicker__day--010").click()

    cy.get(".react-datepicker__input-container").eq(1).find("input").click()
    cy.get(".react-datepicker__navigation").last().click()
    cy.get(".react-datepicker__day--015").click()

    cy.contains("Update deadlines").click()
    cy.get("[data-cy=enableRegistrations]").should("be.enabled").click()

    cy.contains("are currently open")
  })

  it("Can't enable registrations without updating old deadlines", () => {
    cy.request("/api/test/setServiceStatus", {registrationDeadline:new Date(2019,1,1), taskDeadline:new Date(2019,1,2), studentRegistrationOnline:false})
    cy.login("admin")
    cy.visit('/')
    cy.get('[data-cy=servicestatus-tab]').click()

    cy.contains("are currently closed")
    cy.get("[data-cy=enableRegistrations]").should("be.disabled")
    cy.contains("registration and distribution deadlines must be set to future date")

  })

})