// / <reference types="Cypress" />

const findStudent = (id) => {
  cy.get('input').eq(0).type(id)
  cy.contains('Hae').click()
}

const giveDevice = () => {
  cy.get('#device-serial-input').type('AB12')
  cy.contains('Anna laite').click()
}

const giveBadDevice = () => {
  cy.get('#device-serial-input').type('x')
  cy.contains('Anna laite').click()
}

context('Distributor', () => {
  beforeEach(() => {
    cy.request('localhost:8000/api/test/reset/user')
    cy.server({
      onAnyRequest(route, proxy) {
        proxy.xhr.setRequestHeader('uid', 'fuksi')
        proxy.xhr.setRequestHeader('givenName', 'fuksiEtunimi')
        proxy.xhr.setRequestHeader('mail', 'grp-toska+fukrekfuksi@helsinki.fi')
        proxy.xhr.setRequestHeader('schacDateOfBirth', 19770501)
        proxy.xhr.setRequestHeader('schacPersonalUniqueCode', 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:fuksi')
        proxy.xhr.setRequestHeader('sn', 'fuksi')
      },
    })
    cy.visit('localhost:8000')
    cy.contains('FUKSILAITTEET')
    cy.contains('I want a device, but').click()
    cy.server({
      onAnyRequest(route, proxy) {
        proxy.xhr.setRequestHeader('uid', 'jakelija')
        proxy.xhr.setRequestHeader('employeeNumber', '1234')
        proxy.xhr.setRequestHeader('givenName', 'jakelijaEtunimi')
        proxy.xhr.setRequestHeader('mail', 'grp-toska+fail@helsinki.fi')
        proxy.xhr.setRequestHeader('sn', 'jakelija')
      },
    })
    cy.visit('localhost:8000')
    cy.contains('FUKSILAITTEET')
  })

  it('Redirects provider to the correct page', () => {
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
    findStudent('fuksi')
    cy.contains('Opiskelija on jo saanut laitteen!')
    cy.contains('fuksiEtunimi fuksi').should('not.exist')
  })

  it('Can\'t give a device to a non-existent student', () => {
    findStudent('1234')
    cy.contains('Opiskelijaa ei löytynyt!')
  })

  it('Can\'t give a device to a non-eligible student', () => {
    cy.server({
      onAnyRequest(route, proxy) {
        proxy.xhr.setRequestHeader('uid', 'non_fuksi_student')
        proxy.xhr.setRequestHeader('givenName', 'non-fuksiEtunimi')
        proxy.xhr.setRequestHeader('mail', 'grp-toska+fail@helsinki.fi')
        proxy.xhr.setRequestHeader('schacDateOfBirth', 19850806)
        proxy.xhr.setRequestHeader('schacPersonalUniqueCode', 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:non-fuksi')
        proxy.xhr.setRequestHeader('sn', 'non-fuksi')
      },
    })
    cy.visit('localhost:8000')
    cy.contains('Unfortunately you are not eligible for the fresher device.')
    cy.server({
      onAnyRequest(route, proxy) {
        proxy.xhr.setRequestHeader('uid', 'jakelija')
        proxy.xhr.setRequestHeader('employeeNumber', '1234')
        proxy.xhr.setRequestHeader('givenName', 'jakelijaEtunimi')
        proxy.xhr.setRequestHeader('mail', 'grp-toska+fail@helsinki.fi')
        proxy.xhr.setRequestHeader('sn', 'jakelija')
      },
    })
    cy.visit('localhost:8000')
    findStudent('non-fuksi')
    cy.contains('Ei oikeutettu laitteeseen!')
  })
})
