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

// If using mac, using cmd; otherwise, use ctrl for linux-based and windows-based systems
const deleteShortcut = Cypress.platform === 'darwin' ? '{cmd+a}{del}' : '{ctrl+a}{del}';

Cypress.Commands.add('readFileIntoCodeEditor', (filepath, contentToAppend = '') => {
    cy.readFile(filepath).then((contentFromFile) => {
        // Append additional text if provided
        const updatedContent = `${contentFromFile}${contentToAppend}`;

        // Clear the Monaco Editor and type new content
        cy.window().then((win) => {
            win.editor.setValue(updatedContent);
        });
    });
})

Cypress.Commands.add('appendCodeEditor', (text) => {
    cy.get('[data-cy="code-editor"] .monaco-editor textarea')
        .should('be.visible')
        .focus()
        .type(`{ctrl+end}${text}`, { force: true });
});

Cypress.Commands.add('containsInCodeEditor', function (text) {
    cy.get('[data-cy="code-editor"]').get('.monaco-editor').realClick().realMouseWheel({ scrollBehavior: "top", deltaY: -10000 })
    cy.contains(text)
});

Cypress.Commands.add('clearCodeEditor', function () {
    cy.get('[data-cy="code-editor"]').get('.monaco-editor')
        .realClick().type(deleteShortcut);
});

Cypress.Commands.add("dragAndDropKeyboard", (sourceSelector, directions) => {
    const keyMap: { [key: string]: string } = {
        up: "{upArrow}",
        down: "{downArrow}",
        left: "{leftArrow}",
        right: "{rightArrow}"
    };
    const validDirections = Object.keys(keyMap);

    const invalidDirections = directions.filter(dir => !validDirections.includes(dir));
    if (invalidDirections.length > 0) {
        throw new Error(
            `dragAndDropKeyboard: Invalid direction(s): ${invalidDirections.join(", ")}. ` +
            `Allowed directions are: ${validDirections.join(", ")}.`
        );
    }

    cy.get(sourceSelector)
        .should("exist")
        .focus()
        .type(" "); // space to start drag

    directions.forEach((dir) => {
        cy.focused().type(keyMap[dir]);
    });

    cy.focused().type(" "); // space to drop
});

Cypress.Commands.add('dragAndDropRelative', function (sourceSelector, targetSelector) {
    cy.get(sourceSelector).as('source');
    cy.get(targetSelector).as('target');

    cy.get('@source').then(($source) => {
        const sourceRect = $source[0].getBoundingClientRect();

        cy.get('@target').then(($target) => {
            const targetRect = $target[0].getBoundingClientRect();

            // determine direction
            const deltaX = targetRect.left - sourceRect.left;
            const deltaY = targetRect.top - sourceRect.top;
            const directions = [];
            const threshold = 5;

            // vertical movement
            if (Math.abs(deltaY) > threshold) {
                const verticalDirection = deltaY > 0 ? 'down' : 'up';
                directions.push(verticalDirection)
            }

            // horizontal movement
            if (Math.abs(deltaX) > threshold) {
                const verticalDirection = deltaX > 0 ? 'right' : 'left';
                directions.push(verticalDirection)
            }

            //TODO: Use dragAndDropKeyboard

            // drag
            cy.wrap($source).focus();
            cy.wrap($source).type(" ");

            // move
            directions.forEach((direction) => {
                cy.wrap($source).type(`{${direction}Arrow}`)
            })

            // drop
            cy.wrap($source).type(" ");
        });
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            readFileIntoCodeEditor(filepath: string, contentToAppend?: string): Chainable<void>
            appendCodeEditor(text: string): Chainable<void>
            containsInCodeEditor(text: string): Chainable<void>
            clearCodeEditor(): Chainable<void>
            dragAndDropKeyboard(sourceSelector: string, directions: string[]): Chainable<void>
            dragAndDropRelative(sourceSelector: string, targetSelector: string): Chainable<void>
        }
    }
}