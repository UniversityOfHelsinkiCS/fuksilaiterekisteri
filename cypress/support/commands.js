// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { setHeaders } from "../../client/util/fakeShibboleth"

Cypress.Commands.add("login", (uid) => {
  cy.log("Logging in as", uid)
  setHeaders(uid)
  cy.visit("/")
 })

// Simulate how a user account would normally be generated:
Cypress.Commands.add("createUser", (uid) => {
  setHeaders(uid)
  cy.route("POST",'/api/login').as('createUser')
  cy.visit("/")
  cy.wait("@createUser")
})

Cypress.Commands.add("resetReclaimCases", () => {
  cy.request("GET", '/api/test/reset/reclaimCase')
})

// Add user straight into DB
Cypress.Commands.add("createCustomUser", (userInfo, studyProgramCode = 'KH50_005') => {
  console.log(studyProgramCode)
  cy.request("POST", '/api/test/createUser', {userInfo, studyProgramCode})
})