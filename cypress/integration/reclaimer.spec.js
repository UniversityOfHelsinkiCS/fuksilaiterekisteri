/// <reference types="Cypress" />

const selectFilter = (filter) => {
  cy.get('[data-cy=reclaimStatusFilter]').click()
  cy.get('[data-cy=reclaimStatusFilter]').contains(filter).click()
}

const createTestUsers = () => {
  cy.createCustomUser({
    userId: 'oldDeviceHolder',
    name: 'Laite Vanhatar',
    deviceGivenAt: new Date('2000').getTime()
  })
  cy.createCustomUser({
    userId: 'modelStudent',
    name: 'Oppilas Mallikas',
    deviceGivenAt: new Date().getTime()
  })
  cy.createCustomUser({
    userId: 'absentDeviceHolder',
    name: 'Haltija Poissanen',
    deviceGivenAt: new Date().getTime()
  })
  cy.createCustomUser({
    userId: 'lowCreditsDeviceHolder',
    name: 'Haltija Pisteetön',
    deviceGivenAt: new Date().getTime()
  })
  cy.createCustomUser({
    userId: 'exDeviceHolder',
    name: 'Haltijaton Paikalloton',
    deviceReturned: true,
    deviceGivenAt: new Date('2000').getTime()
  })
  cy.createCustomUser({
    userId: 'seniorOpiskelija',
    name: 'Senior Opiskelija',
    deviceGivenAt: new Date().getTime(),
    signupYear: 2017,
  })
  cy.createCustomUser({
    userId: 'vastaamatoVille',
    name: 'Vastaamaton Ville',
    deviceGivenAt: new Date('2000').getTime(),
    reclaimStatus: 'CONTACTED'
  })
  cy.createCustomUser({
    userId: 'uusiOpiskelija',
    name: 'Uusi Opiskelija',
    deviceGivenAt: new Date('2000').getTime(),
    signupYear: 2019,
  })
  cy.createCustomUser({
    userId: 'openOpiskelija',
    name: 'Open Opiskelija',
    deviceGivenAt: new Date('2000').getTime(),
    reclaimStatus: 'OPEN',
  })
  cy.createCustomUser({
    userId: 'vanhaOngelmatar',
    name: 'Vanha Ongelmatar',
    deviceGivenAt: new Date('2000').getTime(),
    signupYear: 2017,
  })
}

context('Reclaimer View', () => {
  it('Redirects reclaimer to the correct page', () => {
    cy.login('reclaimer')
    cy.visit('/')
    cy.contains('Run student status updater')
  })

  context('Table',  () => {
    before(() => {
      cy.server()
      cy.createUser('fuksi')
      createTestUsers()
      cy.login('reclaimer')
      cy.visit('/')
      cy.get('[data-cy=updateReclaimStatuses]').click()
    })

    beforeEach(() => {
      selectFilter('Open')
    })

    it('Doesn\'t show students without device', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'fuksiEtunimi')
    })
  
    it('Doesn\'t show student who is present with more than 30 credits first year and device newer than five years', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Oppilas Mallikas')
    })
  
    it('Doesn\'t show student who has returned device regardless of status', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Haltijation Paikalloton')
    })
  
    it('Shows student with device older than five years', () => {
      cy.get('[data-cy=reclaimerContent]').contains('Laite Vanhatar')
    })
  
    it('Shows device holder who isn\'t present in current semester', () => {
      cy.get('[data-cy=reclaimerContent]').contains('Haltija Poissanen')
    })
  
    it('Shows device holder with under 30 credits first study year', () => {
      cy.get('[data-cy=reclaimerContent]').contains('Haltija Pisteetön')
    })
  
    it('Doesn\'t show third+ year student with under 30 credits on first study year', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Senior Opiskelija')
    })
  
    it('Doesn\'t reset reclaim status for contacted students when statuses are updated', () => {
      selectFilter("Contacted")
      cy.get('[data-cy=reclaimerContent]').contains('CONTACTED')    
    })
  
    it('Doesn\'t show students who signed up this year', () => {
      cy.get('[data-cy=reclaimerContent]').should('not.contain', 'Uusi Opiskelija')
    })
  
    it('Shows 3rd+ year student instead of credits for 3rd+ year students', () => {
      cy.contains('Vanha Ongelmatar').parent().parent().contains('3rd+ year student')
    })
  })

  context('Actions', () => {
    beforeEach(() => {
      cy.server()
      cy.createUser('fuksi')
      createTestUsers()
      cy.login('reclaimer')
      cy.visit('/')
      cy.get('[data-cy=updateReclaimStatuses]').click()
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
      cy.visit('/')
  
      cy.contains('Haltija Poissanen').parent().parent().find('[data-cy=markDeviceReturned]').click()
  
      cy.login('reclaimer')
      cy.visit('/')
  
      selectFilter("Closed")
      cy.contains('Haltija Poissanen').parent().parent().contains('CLOSED')
    })
  })
})