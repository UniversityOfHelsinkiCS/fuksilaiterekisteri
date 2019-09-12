// / <reference types="Cypress" />

context('Student', () => {
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

  it('allows eligible students to sign up with email', () => {
    cy.get('button').should('have.class', 'disabled')
    cy.get('input').type('fuksi@helsinki.fi')
    cy.get('button').should('have.class', 'disabled')
    cy.get('input').clear()

    cy.get('input').type('fuksi@fuksi.fuksi')
    cy.get('button').should('not.have.class', 'disabled')
    cy.contains('I want a device').click()
    cy.contains('Task status:')
  })

  it('allows eligible students to sign up without email', () => {
    cy.contains('I want a device, but').click()
    cy.contains('Task status:')
  })

  it('doesn\'t allow non-eligible students to sign up', () => {
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

  it('doesn\'t allow non-students to sign up', () => {
    cy.server({
      onAnyRequest(route, proxy) {
        proxy.xhr.setRequestHeader('uid', 'noone')
        proxy.xhr.setRequestHeader('employeeNumber', 'nope')
        proxy.xhr.setRequestHeader('givenName', 'noone')
        proxy.xhr.setRequestHeader('mail', 'nono')
        proxy.xhr.setRequestHeader('sn', 'nobody')
      },
    })
    cy.visit('localhost:8000')
    cy.contains('FUKSILAITTEET')
    cy.contains('Hei, sinulla ei ole oikeuksia fuksilaite-palveluun. Ota yhteyttä grp-toska@helsinki.fi jos sinulla kuuluisi olla oikeudet.')
    cy.visit('localhost:8000/student')
    cy.location('pathname').should('eq', '/unauthorized')
    cy.contains('Hei, sinulla ei ole oikeuksia fuksilaite-palveluun. Ota yhteyttä grp-toska@helsinki.fi jos sinulla kuuluisi olla oikeudet.')
  })

  it('doesn\'t allow students to see admin or distributor page', () => {
    cy.visit('localhost:8000/admin')
    cy.location('pathname').should('eq', '/student')
    cy.visit('localhost:8000/distributor')
    cy.location('pathname').should('eq', '/student')
  })
})
