/// <reference types="Cypress" />

const isEligible = (uid) => {
  cy.login(uid)
  cy.get('[data-cy=terms]')
}

const isNotEligible = (uid) => {
  cy.login(uid)
  cy.get("[data-cy=notEligible]")
}

describe("Eligiblity checker", () => {

  describe("Eligible=true", () => {
    it("Current year's fuksi", () => {
      isEligible("fuksi")
    })
   
    it("Previous year's fuksi, postponed for valid reason", () => {
      isEligible("eligible2")
    })

    it("From 2008 onwards can get device, if has postponed till current year for valid reason", () => {
      isEligible("eligible3")
    })

  })

  describe("Eligible=false", () => {
    it("Pre 2008 student with no new studyright", () => {
      isNotEligible("ineligible1")
    })

    it("Current year's fuksi, not present", () => {
      isNotEligible("ineligible2")
    })

    it("Student with pre 2008 studyright and new studyright", () => {
      isNotEligible("ineligible3")
    })

  })

})