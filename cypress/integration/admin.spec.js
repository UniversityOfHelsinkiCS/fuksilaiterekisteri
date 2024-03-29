/// <reference types="Cypress" />

context('Admin', () => {

  beforeEach(() => {
    cy.createUser("non_fuksi_student")
    cy.createUser("non_admin_staff")
    cy.login("admin")
  })

  it('Redirects admin to the correct page', () => {
    cy.contains('admin')
    cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn').find('input[checked]').eq(1)
  })

  it('Can toggle student eligiblity which also updates student signup year', () => {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('Some text')
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Mark eligible)').click()
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 1)
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Mark ineligible)').click()
      cy.contains('non-fuksiEtunimi').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 0)
    })
  })

  it('Marking eligible updates student sign up year',  () => {
    cy.createCustomUser({
      userId: 'ineligible1',
      name: 'Vanha Oikeutettu',
      studentNumber: 'oldEligible',
      eligible: false,
      signUpYear: 2018,
    })
    cy.visit('/')

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('Some text')
      cy.contains('Vanha Oikeutettu').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Mark eligible)').click()
      cy.contains('Vanha Oikeutettu').parent().parent().find('.ReactVirtualized__Table__rowColumn:contains(Kyllä)').should('have.length', 1)

      cy.contains('Current years eligible students').click()
      cy.contains('Vanha Oikeutettu')
    })
  })

  it('Can give staff role', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleStaff"]').click()
    cy.login("non_fuksi_student")
    cy.contains("Sinulla on oikeus")
  })

  it('Can update staff study programs', () => {
    cy.contains('non-admin-staff').parent().parent().find('[data-cy="staffSettings"]').click()
    cy.get('[data-cy="studyProgramCheckboxes"]').contains('Kemian kandiohjelma').click()
    cy.get('[data-cy="saveStudyPrograms"]').click()
  
    cy.login("non_admin_staff")
    cy.contains("Kemian kandiohjelma (KH50_003)")
  })
  
  it('Removes staff role when removing all study program rights', () => {
    cy.contains('non-admin-staff').parent().parent().find('[data-cy="staffSettings"]').click()
    cy.get('[data-cy="studyProgramCheckboxes"]').contains('Tietojenkäsittely').click()
    cy.get('[data-cy="saveStudyPrograms"]').click()
  
    cy.login("non_admin_staff")
    cy.contains('Hei, sinulla ei ole oikeuksia')
  })
  
  it('Opens study program modal when giving staff role if no rights exist', () => {
    cy.contains('non-admin-staff').parent().parent().find('[data-cy="staffSettings"]').click()
    cy.get('[data-cy="studyProgramCheckboxes"]').contains('Tietojenkäsittely').click()
    cy.get('[data-cy="saveStudyPrograms"]').click()

    cy.contains('non-admin-staff').parent().parent().find('[data-cy="toggleStaff"]').should("not.have.class","checked") // Wait for previous user-update to be visible
  
    cy.contains('non-admin-staff').parent().parent().find('[data-cy="toggleStaff"]').click()
  
    cy.contains('Edit study programs')
  })

  it('Can give admin role', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleAdmin"]').click()
    cy.login("non_fuksi_student")
    cy.get('[data-cy=servicestatus-tab]')
  })

  it("Can't remove admin from self", () => {
    cy.get(".ReactVirtualized__Table").contains("adminEtunimi").parent().parent().find("[data-cy=toggleAdmin] > input").should("be.disabled")
  })

  it('Can give distributor role', () => {
    cy.contains('non-fuksiEtunimi').parent().parent().find('[data-cy="toggleDistributor"]').click()
    cy.login("non_fuksi_student")
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

   it('Can save admin note for user', () => {
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

  it("Can mark device as returned and see by whom and when the device was returned", () => {
    cy.createUser("fuksi")
    cy.contains('FUKSILAITTEET')
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=closeTerms]').click()
    cy.get('[data-cy=acceptTerms]').click()
    cy.get('[data-cy=getDeviceSecondary]').click()
    cy.get('[data-cy=taskStatus]').contains('Tehtävien tila')

    cy.login("jakelija")
    cy.contains('FUKSILAITTEET')

    cy.get('input').eq(0).type("fuksi")
    cy.contains('Hae').click()

    cy.route("POST",'/api/claim_device').as('claimDevice')
    cy.get('#device-serial-input').type('XXXRAB12')
    cy.contains('Anna laite').click()
    cy.wait("@claimDevice").then(res => 
      cy.log(res.responseBody.debug?.toString())
        .then(() => expect(res.status).to.eq(200))
    )

    cy.login("admin")

    cy.contains('fuksiEtunimi fuksi').parent().parent().find("[data-cy=markDeviceReturned]").click()
    cy.contains('fuksiEtunimi fuksi').parent().parent().find("[data-cy=markDeviceReturned]").should("be.disabled")

    cy.contains('fuksiEtunimi fuksi').parent().parent().find(".device_returned_at").should("not.be.empty")
    cy.contains('fuksiEtunimi fuksi').parent().parent().find(".device_returned_by").should("have.text","admin")

  })

  it("Can update device serial", () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('NEW123')
      }
    })

    cy.createCustomUser({
      userId: 'perusUser',
      name: 'Perus User',
      studentNumber: '12345',
      eligible: true,
      signUpYear: 2018,
      deviceSerial:"RAB12"
    })

    cy.contains('erus User').parent().parent().find("[data-cy=updateSerial]").click()
    cy.contains("Serial updated")
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

  it("Can update device serial and adjust separator position", () => {
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get("[data-cy=deviceSerial] > input").clear().type("STATICPARTcustompart")
    cy.get('[data-cy=letter-1]').click()
    cy.get('[data-cy=updateSerial]').should("be.disabled")
    cy.get('[data-cy=letter-11]').click()
    cy.get("[data-cy=updateSerial]").click()
    cy.reload()
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get("[data-cy=deviceSerial] > input").should("have.value","STATICPARTCUSTOMPART")
    cy.get('[data-cy=letter-11]').should("have.css","color","rgb(0, 128, 0)")
    cy.get('[data-cy=letter-10]').should("have.css","color","rgb(255, 0, 0)")
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
    cy.contains("Contact Name")
    cy.contains("Contact.Name@email.com")
  })

})

describe("Deadline sanity checks", () => {

  it("Registration deadline can't be after distribution deadline", () => {
    cy.request("/api/test/setServiceStatus", {registrationDeadline:null, taskDeadline:null, studentRegistrationOnline:false})
    cy.login("admin")
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
    cy.get('[data-cy=servicestatus-tab]').click()

    cy.contains("are currently closed")
    cy.get("[data-cy=enableRegistrations]").should("be.disabled")
    cy.contains("registration and distribution deadlines must be set to future date")

  })

})

describe("Email template tests", () => {

  beforeEach(() => {
    cy.request("/api/test/resetTemplates/ADMIN")
    cy.login("admin")
    cy.get('.tabular > :nth-child(2)').contains("Email").click()
    cy.contains("Manage email templates").click()
  })

  it("Can create, update and delete a template", () => {
    cy.get('[data-cy=selectTemplate]').should("have.class","disabled")
    cy.get('[data-cy=description] > input').type("My first template")
    cy.get('[data-cy=subject] > input').type("Test subject")
    cy.get('[data-cy=body]').type("Test content")
    cy.contains("Create a new template").click()
    cy.contains("Email template saved.")

    cy.get('[data-cy=body]').clear().type("Updated test content")
    cy.contains("Update this template").click()

    cy.visit("/")
    cy.get('.tabular > :nth-child(2)').contains("Email").click()
    cy.contains("Manage email templates").click()
    cy.get('[data-cy=selectTemplate]').click()
    cy.get('[data-cy=selectTemplate]').find(".item").eq(0).click()
    cy.get('[data-cy=body]').contains("Updated test content")

    cy.contains("Delete this template").click()
    cy.contains("Email template deleted.")
    cy.get('[data-cy=selectTemplate]').should("have.class","disabled")
   })

   it("Can create and select a template when sending mass-email", () => {
    cy.get('[data-cy=selectTemplate]').should("have.class","disabled")
    cy.get('[data-cy=description] > input').type("My first template")
    cy.get('[data-cy=replyTo] > input').type("testReplyTo@test.com")
    cy.get('[data-cy=subject] > input').type("Test subject")
    cy.get('[data-cy=body]').type("Test content")
    cy.contains("Create a new template").click()
    cy.contains("Email template saved.")
    cy.contains("Send mass email").click()
    cy.get('[data-cy=selectTemplate]').click()
    cy.get('[data-cy=selectTemplate]').find(".item").eq(0).click()
    cy.get('input[name="replyTo"]').should("have.value","testReplyTo@test.com")
    cy.get('input[name="subject"]').should("have.value","Test subject")
    cy.get("textarea").contains("Test content")
   })



})