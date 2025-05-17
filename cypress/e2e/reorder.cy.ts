// npm run cypress:open

describe('timeline drag and drop', () => {
    beforeEach(() => {
        cy.viewport(2000, 1000, { log: false });
        cy.visit('http://localhost:3000/editor');
        cy.clearCodeEditor();

        // set, verify, and save treatment
        cy.readFileIntoCodeEditor('cypress/fixtures/reorder.yaml')
        cy.containsInCodeEditor('drag_and_drop_test');
        cy.get('[data-cy="code-editor-save"]').realClick();
    });

    it('allows reordering of elements within stage', () => {
        // verify initial order
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);
        cy.get('[data-cy="element-0-0"]').contains("Element 1").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");

        // swap first element with second element
        cy.dragAndDropRelative('[data-cy="element-drag-0-0"]', '[data-cy="element-drag-0-1"]');

        // verify new order
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);
        cy.get('[data-cy="element-0-0"]').contains("Element 2").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 1").should("be.visible");
    })

    it('allows reordering of stages', () => {
        // verify initial order
        cy.get('[data-cy^="stage-card-"]').should('have.length', 2);
        cy.get('[data-cy="stage-card-0"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy="stage-card-1"]').contains("Stage 2").should("be.visible");

        // swap first stage with second stage
        cy.dragAndDropRelative('[data-cy="stage-drag-card-0"]', '[data-cy="stage-drag-card-1"]');

        // verify new order
        cy.get('[data-cy^="stage-card-"]').should('have.length', 2);
        cy.get('[data-cy="stage-card-0"]').contains("Stage 2").should("be.visible");
        cy.get('[data-cy="stage-card-1"]').contains("Stage 1").should("be.visible");
    })

    it('rejects dragging elements to invalid spots', () => {
        // verify initial order
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);
        cy.get('[data-cy="element-0-0"]').contains("Element 1").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");

        // try moving first element from stage 1 to stage 2
        cy.dragAndDropRelative('[data-cy="element-drag-0-0"]', '[data-cy="element-drag-1-0"]');

        // verify that order remains the same
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);
        cy.get('[data-cy="element-0-0"]').contains("Element 1").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");

        // try moving second element outside of stage 1
        cy.dragAndDropKeyboard('[data-cy="element-drag-0-1"]', ['right']);

        // verify that order remains the same
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);
        cy.get('[data-cy="element-0-0"]').contains("Element 1").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");
    })

    it('rejects dragging stages outside of timeline', () => {
        // verify initial order
        cy.get('[data-cy^="stage-card-"]').should('have.length', 2);
        cy.get('[data-cy="stage-card-0"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy="stage-card-1"]').contains("Stage 2").should("be.visible");

        // try dragging stage outside of timeline 
        cy.dragAndDropKeyboard('[data-cy="stage-drag-card-0"]', ['up']);

        // verify that order remains the same
        cy.get('[data-cy^="stage-card-"]').should('have.length', 2);
        cy.get('[data-cy="stage-card-0"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy="stage-card-1"]').contains("Stage 2").should("be.visible");
    })
})