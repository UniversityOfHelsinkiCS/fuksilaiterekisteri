/// <reference types="Cypress" />

const findStudent = (id) => {
  cy.get('input').eq(0).type(id)
  cy.contains('Hae').click()
}

const giveDevice = (serial) => {
  cy.get('#device-serial-input').type(serial ? serial : 'RAB12')
  cy.contains('Anna laite').click()
}

const giveBadDevice = (serial) => {
  cy.get('#device-serial-input').type(serial ? serial : "x")
  cy.contains('Anna laite').click()
}

context('Distributor', () => {
  beforeEach(() => {

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
    cy.get('[data-cy=notEligible]')

    cy.login("jakelija")
    cy.visit("/")
    findStudent('non-fuksi')
    cy.contains('Ei oikeutettu laitteeseen!')
  })

  it("Can't give a device to a previous years eligible student", () => {
    cy.request("/api/test/advance")
    cy.login("jakelija")
    cy.visit("/")
    findStudent('fuksi')
    cy.contains('Ei oikeutettu laitteeseen!')
  })

  it("Can 'register' when studentRegistration is closed", () => {
    cy.request("/api/test/disableStudentRegs")
    cy.request("/api/test/reset/user")
    cy.visit("/")
  })
})

describe("Serial validation works", () => {
  
  beforeEach(() => {
    cy.createUser("fuksi")
    cy.contains('FUKSILAITTEET')
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=closeTerms]').click()
    cy.get('[data-cy=acceptTerms]').click()
    cy.get('[data-cy=getDeviceSecondary]').click()
    cy.get('[data-cy=taskStatus]').contains('Tehtävien tila')
    cy.login("jakelija")
    cy.visit("/")
  })

  describe("Correct", () =>{
    it("10 static, 10 custom", () => {
      cy.request("/api/test/setSerial/0123456789")
      cy.visit("/")
      findStudent('fuksi')
      giveDevice("IIIIIIIIII")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
    })
  
    it("1 static, 19 custom", () => {
      cy.request("/api/test/setSerial/1")
      cy.visit("/")
      findStudent('fuksi')
      giveDevice("IIIIIIIIIIIIIIIIIII")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
    })
  
    it("15 static, 5 custom", () => {
      cy.request("/api/test/setSerial/012345678901234")
      cy.visit("/")
      findStudent('fuksi')
      giveDevice("12345")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
    })
  })

  describe("Incorrect", () =>{ 
    it("undefined", () => {
      cy.request("/api/test/setSerial/012345678901234")
      cy.visit("/")
      findStudent('fuksi')
      giveBadDevice("")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("too long", () => {
      cy.request("/api/test/setSerial/012345678901234")
      cy.visit("/")
      findStudent('fuksi')
      giveBadDevice("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("deviceSerial", () => {
      cy.request("/api/test/setSerial/012345678901234")
      cy.visit("/")
      findStudent('fuksi')
      giveBadDevice("012345678901234")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("order", () => {
      cy.request("/api/test/setSerial/012345678901234")
      cy.visit("/")
      findStudent('fuksi')
      giveBadDevice("aaaaa012345678901234")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("case sensitivity", () => {
      cy.request("/api/test/setSerial/AbC1234567")
      cy.visit("/")
      findStudent('fuksi')
      giveBadDevice("ABC12345671111111111")
      cy.contains('fuksiEtunimi fuksi')
    })
  })
})