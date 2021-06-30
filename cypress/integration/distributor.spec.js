/// <reference types="Cypress" />

const findStudent = (id) => {
  cy.get('input').eq(0).type(id)
  cy.contains('Hae').click()
}

const giveDevice = (serial) => {
  cy.get('#device-serial-input').type(serial ? serial : 'XXX12345')
  cy.contains('Anna laite').click()
}

const giveBadDevice = (serial) => {
  cy.get('#device-serial-input').type(serial ? serial : "x")
  cy.contains('Anna laite').should('be.disabled')
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
    findStudent('non-fuksi')
    cy.contains('Ei oikeutettu laitteeseen!')
  })

  it("Can't give a device to a previous years eligible student", () => {
    cy.request("/api/test/advance")
    cy.login("jakelija")
    findStudent('fuksi')
    cy.contains('Ei oikeutettu laitteeseen!')
  })

  it("Can 'register' when studentRegistration is closed", () => {
    cy.request("/api/test/disableStudentRegs")
    cy.request("/api/test/reset/user")
    cy.visit("/")
  })
})

describe("Serial setting and validation works and correct part of the serial is stored in the database", () => {

  const setSerialValidationPattern = (pattern,startOfCustompart) => {
    cy.login("admin")
    cy.get('[data-cy=servicestatus-tab]').click()
    cy.get('[data-cy=deviceSerial] > input').clear().type(pattern)
    cy.get(`[data-cy=letter-${startOfCustompart}]`).click()
    cy.get('[data-cy=updateSerial]').click()
    cy.login("jakelija")
  }

  
  beforeEach(() => {
    cy.createUser("fuksi")
    cy.contains('FUKSILAITTEET')
    cy.get('[data-cy=terms]').click()
    cy.get('[data-cy=closeTerms]').click()
    cy.get('[data-cy=acceptTerms]').click()
    cy.get('[data-cy=getDeviceSecondary]').click()
    cy.get('[data-cy=taskStatus]').contains('Tehtävien tila')
  })

  describe("Correct", () =>{

    it("2019", () => {
      setSerialValidationPattern("1s20N3S2NJ00PF1XXXXX",13)
      findStudent('fuksi')
      giveDevice("PF1XXXXX")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
      cy.login("admin")
      cy.contains('fuksiEtunimi fuksi').parent().parent().contains("PF1XXXXX")
    })

    it("10 static, 10 custom", () => {
      setSerialValidationPattern("0123456789XXXXXXXXXX",11)
      findStudent('fuksi')
      giveDevice("IIIIIIIIII")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
      cy.login("admin")
      cy.contains('fuksiEtunimi fuksi').parent().parent().contains("IIIIIIIIII")
    })
  
    it("1 static, 19 custom", () => {
      setSerialValidationPattern("1XXXXXXXXXXXXXXXXXXX",2)
      findStudent('fuksi')
      giveDevice("IIIIIIIIIIIIIIIIIII")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
      cy.login("admin")
      cy.contains('fuksiEtunimi fuksi').parent().parent().contains("IIIIIIIIIIIIIIIIIII")
    })
  
    it("15 static, 5 custom", () => {
      setSerialValidationPattern("012345678901234XXXXX",16)
      findStudent('fuksi')
      giveDevice("12345")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
      cy.login("admin")
      cy.contains('fuksiEtunimi fuksi').parent().parent().contains("12345")
    })

    it("Non 20 length serial FULL", () => {
      setSerialValidationPattern("0123456789012345678901234XXXXXXX",26)
      findStudent('fuksi')
      giveDevice("0123456789012345678901234custom1")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
      cy.login("admin")
      cy.contains('fuksiEtunimi fuksi').parent().parent().contains("custom1")
    })

    it("Non 20 length serial MANUAL", () => {
      setSerialValidationPattern("0123456789012345678901234XXXXXXX",22)
      findStudent('fuksi')
      giveDevice("1234custom1")
      cy.contains('fuksiEtunimi fuksi').should('not.exist')
      cy.login("admin")
      cy.contains('fuksiEtunimi fuksi').parent().parent().contains("1234custom1")
    })

  })

  describe("Incorrect", () =>{ 
    it("undefined", () => {
      setSerialValidationPattern("012345678901234XXXXX",16)
      findStudent('fuksi')
      giveBadDevice("")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("too long", () => {
      setSerialValidationPattern("012345678901234XXXXX",16)
      findStudent('fuksi')
      giveBadDevice("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("deviceSerial", () => {
      setSerialValidationPattern("012345678901234XXXXX",16)
      findStudent('fuksi')
      giveBadDevice("012345678901234")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("order", () => {
      setSerialValidationPattern("012345678901234XXXXX",16)
      findStudent('fuksi')
      giveBadDevice("aaaaa012345678901234")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("case sensitivity", () => {
      setSerialValidationPattern("ABCXXX",4)
      findStudent('fuksi')
      giveBadDevice("abc123")
    })
    it("Non 20 length serial FULL", () => {
      setSerialValidationPattern("0123456789012345678901234XXXXXXX",26)
      findStudent('fuksi')
      giveBadDevice("012345678901X345678901234custom1")
      cy.contains('fuksiEtunimi fuksi')
    })
    it("Non 20 length serial MANUAL", () => {
      setSerialValidationPattern("0123456789012345678901234XXXXXXX",22)
      findStudent('fuksi')
      giveBadDevice("tooshort")
      cy.contains('fuksiEtunimi fuksi')
    })
  })
})