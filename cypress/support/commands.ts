/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


import 'cypress-real-events'

Cypress.Commands.add('typeInCodeEditor', function (text) {
    cy.get('[data-cy="code-editor"]').get('.monaco-editor')
        .realClick().type(`{ctrl+end}${text}`)
})

Cypress.Commands.add('containsInCodeEditor', function (text) {
    cy.get('[data-cy="code-editor"]').get('.monaco-editor').realClick().realPress(`{moveToStart}`)
    cy.contains(text)
})

declare global {
    namespace Cypress {
        interface Chainable {
            typeInCodeEditor(text: string): Chainable<void>
            containsInCodeEditor(text: string): Chainable<void>
        }
    }
}