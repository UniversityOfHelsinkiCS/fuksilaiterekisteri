// / <reference types="Cypress" />

context('Staff', () => {
  beforeEach(() => {
    cy.request('localhost:8000/api/test/reset/user')
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
    cy.contains('fuksilaitteeseen')
    cy.server({
      onAnyRequest(route, proxy) {
        proxy.xhr.setRequestHeader('uid', 'admin')
        proxy.xhr.setRequestHeader('givenName', 'adminEtunimi')
        proxy.xhr.setRequestHeader('mail', 'grp-toska+fail@helsinki.fi')
        proxy.xhr.setRequestHeader('sn', 'admin')
      },
    })
    cy.visit('localhost:8000')
    cy.contains('admin')
    cy.contains('non-fuksiEtunimi').parent().parent().find('.refresh').eq(0).click()
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
    cy.contains('FUKSILAITTEET')
  })

  it('Redirects staff to the correct page', () => {
    cy.contains('Sinulla on oikeus seuraaviin opinto-ohjelmiin:')
    cy.contains('Tietojenkäsittelytieteen kandiohjelma (KH50_005)')
    cy.contains('non-fuksiEtunimi non-fuksi')
  })
})
