/// <reference types="Cypress" />

const findStudent = (id) => {
  cy.get('input').eq(0).type(id)
  cy.contains('Hae').click()
}

const giveDevice = () => {
  cy.get('#device-serial-input').type('RAB12')
  cy.contains('Anna laite').click()
}

const giveBadDevice = () => {
  cy.get('#device-serial-input').type('x')
  cy.contains('Anna laite').click()
}

context('Distributor', () => {
  beforeEach(() => {

    cy.createUser("fuksi")
    cy.contains('FUKSILAITTEET')
    cy.contains('I want a device, but').click()
    cy.contains('Task status:')

    cy.login("jakelija")
    cy.visit('/')
    cy.contains('FUKSILAITTEET')
  })

  it('Redirects distributor to the correct page', () => {
    cy.contains('fuksilaitteiden jakelu')
  })

  it('Finds an eligible student', () => {
    findStudent('fuksi')
    cy.contains('Muista tarkistaa henkilöllisyys!')
    cy.contains('fuksiEtunimi fuksi')
    cy.contains('Tietojenkäsittelytieteen kandiohjelma')
  })

  it('Gives a device correctly', () => {
    findStudent('fuksi')
    giveDevice()
    cy.contains('fuksiEtunimi fuksi').should('not.exist')
  })

  it('Can\'t submit a badly formatted serial', () => {
    findStudent('fuksi')
    giveBadDevice()
    cy.contains('fuksiEtunimi fuksi')
  })

  it('Can\'t give a device twice to the same student', () => {
    findStudent('fuksi')
    giveDevice()
    cy.contains('fuksiEtunimi fuksi').should('not.exist')
    findStudent('fuksi')
    cy.contains('Opiskelija on jo saanut laitteen!')
    cy.contains('fuksiEtunimi fuksi').should('not.exist')
  })

  it('Can\'t give a device to a non-existent student', () => {
    findStudent('1234')
    cy.contains('Opiskelijaa ei löytynyt!')
  })

  it("Can't give a device to a non-eligible student", () => {
    cy.createUser("non_fuksi_student")
    cy.contains('Unfortunately you are not eligible for the fresher device.')

    cy.login("jakelija")
    cy.visit("/")
    findStudent('non-fuksi')
    cy.contains('Ei oikeutettu laitteeseen!')
  })
})
