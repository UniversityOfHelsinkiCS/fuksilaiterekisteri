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
 })

// Simulate how a user account would normally be generated:
Cypress.Commands.add("createUser", (uid) => {
  setHeaders(uid)
  cy.route("POST",'/api/login').as('createUser')
  cy.visit("/")
  cy.wait("@createUser")
})

// Add user straight into DB
Cypress.Commands.add("createCustomUser", (userInfo) => {

  const uniqueInfo = {
    ...userInfo,
    hyEmail : userInfo.hyEmail ? userInfo.hyEmail : `${userInfo.userId}@helsinki.fi`,
    personalEmail : userInfo.personalEmail ? userInfo.personalEmail : `${userInfo.userId}@toskafake12345.fi`,
  }

  cy.request("POST", '/api/test/createUser', {userInfo:uniqueInfo})
})