// npm run cypress:open

function setInitialTreatment(appendTreatmentTextWith: string = '') {
    cy.readFile('cypress/fixtures/exampleTreatment.yaml').then((yamlContent) => {
        // Append additional text if provided
        const updatedContent = `${yamlContent}${appendTreatmentTextWith}`;

        // Clear the Monaco Editor and type new content
        cy.window().then((win) => {
            win.editor.setValue(updatedContent);
        });

        // Verify initial text in editor
        cy.containsInCodeEditor("simple template test")
        cy.get('[data-cy="yaml-save"]').realClick();
    });
}

describe('complex treatment testing', () => {
    beforeEach(() => {
        cy.viewport(2000, 1000, { log: false });

        cy.visit('http://localhost:3000/editor')
        cy.typeInCodeEditor(`${Cypress.platform === 'darwin' ? '{cmd+a}' : '{ctrl+a}'}{del}`)
    });

    it('renders all stages and elements (including templates) in timeline', () => {
        setInitialTreatment('')

        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="element-0-0"]').contains("template: testA").should("be.visible")  // should render/substitute template elements in future

        cy.get('[data-cy="stage-1"]').should('exist')
        cy.get('[data-cy="element-1-0"]').contains("ExitTicket").should("be.visible")
        cy.get('[data-cy="element-1-1"]').contains("Finish Stage 2").should("be.visible")

        cy.get('[data-cy="stage-2"]').should('exist')
        cy.get('[data-cy="element-2-0"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-2-1"]').contains("submitButton").should("be.visible")

        cy.get('[data-cy="stage-3"]').should('exist')
        cy.get('[data-cy="element-3-0"]').contains("video").should("be.visible")
        cy.get('[data-cy="element-3-1"]').contains("submitButton").should("be.visible")
    })

    it('renders stage 1 submit button when prompt.colors exists', () => {
        setInitialTreatment('')

        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="render-panel"]').contains("Finish").should("not.exist")

        cy.get('[data-cy="reference-value-input"]').type('Red')
        cy.get('[data-cy="save-reference"]').realClick()

        cy.get('[data-cy="render-panel"]').contains("Finish").should("exist")

    })

    it('substitutes fields into template', () => {
        setInitialTreatment('')

        cy.get('[data-cy="stage-2"]').should('exist')
        cy.get('[data-cy="stage-2"]').click(0, 0)

        cy.get('[data-cy="render-panel"]').contains("Finish Stage 3").should("exist")

    })

    // TODO: add test for displayTime, hideTime (bug: unable to move time slider for third stage)
})