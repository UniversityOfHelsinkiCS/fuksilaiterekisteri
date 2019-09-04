// / <reference types="Cypress" />

context('Sign in', () => {
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
  })

  it('allows eligible users to sign up with email', () => {
    cy.get('button').should('have.class', 'disabled')
    cy.get('input').type('fuksi@helsinki.fi')
    cy.get('button').should('have.class', 'disabled')
    cy.get('input').clear()

    cy.get('input').type('fuksi@fuksi.fuksi')
    cy.get('button').should('not.have.class', 'disabled')
    cy.contains('I want a device').click()
    cy.contains('Task status:')
  })

  it('allows eligible users to sign up without email', () => {
    cy.contains('I want a device, but').click()
    cy.contains('Task status:')
  })

  it('doesn\'t allow non-eligible users to sign up', () => {
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
  })
})
