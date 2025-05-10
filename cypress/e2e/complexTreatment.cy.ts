// npm run cypress:open
describe('complex treatment testing', () => {
    beforeEach(() => {
        cy.viewport(2000, 1000, { log: false });
        cy.visit('http://localhost:3000/editor')
        cy.clearCodeEditor();

        // set, verify, and save initial treatment
        cy.readFileIntoCodeEditor('cypress/fixtures/exampleTreatment.yaml')
        cy.containsInCodeEditor("simple template test")
        cy.get('[data-cy="yaml-save"]').realClick();
    });

    it('renders all stages and elements (including templates) in timeline', () => {
        cy.get('[data-cy="stage-card-0"]').should('exist')
        cy.get('[data-cy="element-0-0"]').contains("template: testA").should("be.visible")  // should render/substitute template elements in future

        cy.get('[data-cy="stage-card-1"]').should('exist')
        cy.get('[data-cy="element-1-0"]').contains("ExitTicket").should("be.visible")
        cy.get('[data-cy="element-1-1"]').contains("Finish Stage 2").should("be.visible")

        cy.get('[data-cy="stage-card-2"]').should('exist')
        cy.get('[data-cy="element-2-0"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-2-1"]').contains("submitButton").should("be.visible")

        cy.get('[data-cy="stage-card-3"]').should('exist')
        cy.get('[data-cy="element-3-0"]').contains("video").should("be.visible")
        cy.get('[data-cy="element-3-1"]').contains("submitButton").should("be.visible")
    })

    it('renders stage 1 submit button when prompt.colors exists', () => {
        cy.get('[data-cy="stage-card-0"]').should('exist')
        cy.get('[data-cy="render-panel"]').contains("Finish").should("not.exist")

        cy.get('[data-cy="reference-input-prompt.Colors"]').type('Red')
        cy.get('[data-cy="reference-save-button"]').realClick()

        cy.get('[data-cy="render-panel"]').contains("Finish").should("exist")

    })

    it('substitutes fields into template', () => {
        cy.get('[data-cy="stage-card-2"]').should('exist')
        cy.get('[data-cy="stage-card-2"]').click(0, 0)

        cy.get('[data-cy="render-panel"]').contains("Finish Stage 3").should("exist")

    })

    // TODO: add test for displayTime, hideTime (bug: unable to move time slider for third stage)
})