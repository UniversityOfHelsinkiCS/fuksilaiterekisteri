/// <reference types="Cypress" />

context('Reclaimer', () => {
  before(() => {
    cy.server()
    cy.createUser('fuksi')
    cy.createCustomUser({
      userId: '987',
      name: 'Laite Vanhatar',
      studentNumber: 'oldDeviceHolder',
      deviceSerial: '1234',
      deviceReturned: false,
      deviceGivenAt: new Date(2000).getTime()
    })
    cy.createCustomUser({
      userId: '986',
      name: 'Oppilas Mallikas',
      studentNumber: 'modelStudent',
      deviceSerial: '1235',
      deviceReturned: false,
      deviceGivenAt: new Date().getTime()
    })
    cy.createCustomUser({
      userId: '985',
      name: 'Haltija Poissanen',
      studentNumber: 'absentDeviceHolder',
      deviceSerial: '1236',
      deviceReturned: false,
      deviceGivenAt: new Date().getTime()
    })
    cy.createCustomUser({
      userId: '984',
      name: 'Haltija Pisteetön',
      studentNumber: 'lowCreditsDeviceHolder',
      deviceSerial: '1237',
      deviceReturned: false,
      deviceGivenAt: new Date().getTime()
    })
    cy.createCustomUser({
      userId: '983',
      name: 'Haltijaton Paikalloton',
      studentNumber: 'exDeviceHolder',
      deviceSerial: '1238',
      deviceReturned: true,
      deviceGivenAt: new Date(2000).getTime()
    })
    cy.createCustomUser({
      userId: '982',
      name: 'Senior Opiskelija',
      studentNumber: 'seniorOpiskelija',
      deviceSerial: '1239',
      deviceReturned: false,
      deviceGivenAt: new Date().getTime(),
      signupYear: 2017,
    })
    cy.createCustomUser({
      userId: '981',
      name: 'Vastaamaton Ville',
      studentNumber: 'vastaamatoVille',
      deviceSerial: '1240',
      deviceReturned: false,
      deviceGivenAt: new Date(2000).getTime(),
      reclaimStatus: 'CONTACTED'
    })
    cy.login('reclaimer')
    cy.visit('/')
    cy.get('[data-cy=updateReclaimStatuses]').click()
  })

  it('Redirects reclaimer to the correct page', () => {
    cy.contains('Run student status updater')
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
    cy.get('[data-cy=reclaimerContent]').contains('CONTACTED')
  })

  it('Turns status to closed when clicking close', () => {
    cy.login('reclaimer')
    cy.get('[data-cy=markStatusClosed]').eq(0).click()
    cy.get('[data-cy=reclaimerContent]').contains('CLOSED')
  })

  it('Returning device changes status to closed', () => {
    cy.login('admin')
    cy.visit('/')

    cy.contains('Haltija Poissanen').parent().parent().find('[data-cy=markDeviceReturned]').click()

    cy.login('reclaimer')
    cy.visit('/')

    cy.contains('Haltija Poissanen').parent().parent().contains('CLOSED')
  })
})