/// <reference types="Cypress" />

const selectFilter = (filter) => {
  cy.get('[data-cy=reclaimStatusFilter]').click()
  cy.get('[data-cy=reclaimStatusFilter]').contains(filter).click()
}

const createTestUsers = () => {
  cy.createCustomUser({
    userId: 'oldDeviceHolder',
    name: 'Laite Vanhatar',
    deviceGivenAt: new Date(2013, 9, 15).getTime()
  }, 'KH50_001')
  cy.createCustomUser({
    userId: 'modelStudent',
    name: 'Oppilas Mallikas',
    deviceGivenAt: new Date('2018').getTime()
  }, 'KH50_002')
  cy.createCustomUser({
    userId: 'absentDeviceHolder',
    name: 'Haltija Poissanen',
    deviceGivenAt: new Date('2018').getTime()
  }, 'KH50_003')
  cy.createCustomUser({
    userId: 'lowCreditsDeviceHolder',
    name: 'Haltija Pisteetön',
    deviceGivenAt: new Date('2018').getTime()
  }, 'KH50_004')
  cy.createCustomUser({
    userId: 'exDeviceHolder',
    name: 'Haltijaton Paikalloton',
    deviceReturned: true,
    deviceGivenAt: new Date('2000').getTime()
  })
  cy.createCustomUser({
    userId: 'seniorOpiskelija',
    name: 'Senior Opiskelija',
    deviceGivenAt: new Date('2017').getTime(),
    signupYear: 2017,
  }, 'KH50_005')
  cy.createCustomUser({
    userId: 'vastaamatoVille',
    name: 'Vastaamaton Ville',
    deviceGivenAt: new Date('2000').getTime(),
    reclaimStatus: 'CONTACTED'
  }, 'KH50_006')
  cy.createCustomUser({
    userId: 'uusiOpiskelija',
    name: 'Uusi Opiskelija',
    deviceGivenAt: new Date('2019').getTime(),
    signupYear: 2019,
  }, 'KH50_007')
  cy.createCustomUser({
    userId: 'vanhaOngelmatar',
    name: 'Vanha Ongelmatar',
    deviceGivenAt: new Date('2017').getTime(),
    signupYear: 2017,
  }, 'KH50_001'),
  cy.createCustomUser({
    userId: 'openOpiskelija',
    name: 'Open Opiskelija',
    deviceGivenAt: new Date(2013, 9, 15).getTime(),
  }, 'KH50_008')
}

const runSharedTests = () => {
  it('Doesn\'t show students without device', () => {
    cy.get('[data-cy=reclaimerContent]').should('not.contain', 'fuksiEtunimi')
  })

  it('Doesn\'t show student who is present with more than 30 credits first year and device newer than five years', () => {
    cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Oppilas Mallikas')
  })

  it('Doesn\'t show student who has returned device regardless of status', () => {
    cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Haltijation Paikalloton')
  })

  it('Shows device holder who isn\'t present in current semester', () => {
    cy.get('[data-cy=reclaimerContent]').contains('Haltija Poissanen')
  })
}

context('Reclaimer View', () => {
  it('Redirects reclaimer to the correct page', () => {
    cy.login('reclaimer')
    cy.contains('New student cases')
  })

  context('After running autumn updater', () => {
    before(() => {
      cy.server()
      cy.resetReclaimCases()
      createTestUsers()
      cy.request("GET", '/api/test/run_autumn_updater')
      cy.login('reclaimer')
      cy.get('[data-cy=reclaimerContent]')
    })

    it('Doesn\'t show student with device turning five years old in autumn', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Laite Vanhatar')
    })

    it('Shows device holder with under 30 credits first study year', () => {
      cy.get('[data-cy=reclaimerContent]').contains('Haltija Pisteetön')
    })
  
    it('Doesn\'t show third+ year student with under 30 credits on first study year', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Senior Opiskelija')
    })

    it('Doesn\'t show students who signed up this year', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Uusi Opiskelija')
    })
  
    runSharedTests()
  })

  context('After running spring updater', () => {
    before(() => {
      cy.server()
      cy.resetReclaimCases()
      cy.createUser('fuksi')
      createTestUsers()
      cy.request("GET", '/api/test/run_spring_updater')
      cy.login('reclaimer')
      cy.get('[data-cy=reclaimerContent]')
    })
  
    it('Shows student with device loan time expired', () => {
      cy.get('[data-cy=reclaimerContent]').contains('Laite Vanhatar')
    })

    runSharedTests()
  })

  context('Actions', () => {
    beforeEach(() => {
      cy.server()
      cy.resetReclaimCases()
      cy.createUser('fuksi')
      cy.request("GET", '/api/test/run_autumn_updater')
      cy.request("GET", '/api/test/run_spring_updater')
      cy.login('reclaimer')
      selectFilter('Open')
    })

    it('Can set reclaimStatus to closed and cant reopen closed case', () => {
      cy.contains('Open Opiskelija').parent().parent().find('[data-cy=setStatusManually]').click()
      cy.contains("Set as Closed").click()
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Open Opiskelija')
      selectFilter("Closed")
      cy.get('[data-cy=reclaimerContent]').should('contain', 'Open Opiskelija')
      cy.contains('Open Opiskelija').parent().parent().find('[data-cy=setStatusManually]').should("be.disabled")
    })

    it('Can set reclaimStatus to contacted', () => {
      cy.contains('Open Opiskelija').parent().parent().find('[data-cy=setStatusManually]').click()
      cy.contains("Set as Contacted").click()
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Open Opiskelija')
      selectFilter("Contacted")
      cy.get('[data-cy=reclaimerContent]').should('contain', 'Open Opiskelija')
    })
  
    it('Returning device changes status to closed', () => {
      cy.login('admin')
  
      cy.contains('Haltija Poissanen').parent().parent().find('[data-cy=markDeviceReturned]').click()
  
      cy.login('reclaimer')
  
      selectFilter("Closed")
      cy.contains('Haltija Poissanen').parent().parent().contains('CLOSED')
    })

    it('Filtering cases by semester works', () => {
      cy.get('[data-cy=reclaimerContent]').should('contain', 'Laite Vanhatar')

      cy.get('[data-cy=reclaimSemesterFilter]').click()
      cy.get('[data-cy=reclaimSemesterFilter]').contains('2019 AUTUMN').click()

      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Laite Vanhatar')
      cy.get('[data-cy=reclaimerContent]').should('contain', 'Haltija Pisteetön')
    })
  })

  describe("Reclaimer email template tests", () => {

    beforeEach(() => {
      cy.request("/api/test/resetTemplates/RECLAIM")
      cy.login("reclaimer")
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
      cy.contains("Manage email templates").click()
      cy.get('[data-cy=selectTemplate]').click()
      cy.get('[data-cy=selectTemplate]').find(".item").eq(0).click()
      cy.get('[data-cy=body]').contains("Updated test content")
  
      cy.contains("Delete this template").click()
      cy.contains("Email template deleted.")
      cy.get('[data-cy=selectTemplate]').should("have.class","disabled")
     })
  
     it("Can create and select a template when sending reclaimer-email", () => {
      cy.get('[data-cy=selectTemplate]').should("have.class","disabled")
      cy.get('[data-cy=description] > input').type("My first template")
      cy.get('[data-cy=replyTo] > input').type("testReplyTo@test.com")
      cy.get('[data-cy=subject] > input').type("Test subject")
      cy.get('[data-cy=body]').type("Test content")
      cy.contains("Create a new template").click()
      cy.contains("Email template saved.")

      cy.contains("Reclaimer page").click()
      cy.contains("Compose email for selected").click()

      cy.get('[data-cy=selectTemplate]').click()
      cy.get('[data-cy=selectTemplate]').find(".item").eq(0).click()
      cy.get('input[name="replyTo"]').should("have.value","testReplyTo@test.com")
      cy.get('input[name="subject"]').should("have.value","Test subject")
      cy.get("textarea").contains("Test content")
     })
  })
})