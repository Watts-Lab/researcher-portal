// npm run cypress:open

describe('timeline drag and drop', () => {
    beforeEach(() => {

        cy.viewport(2000, 1000, { log: false });
        cy.visit('http://localhost:3000/editor')
        cy.get('[data-cy="code-editor"]').should('contain.text', 'testA')
        cy.get('[data-cy="yaml-save"]').click()

        // rename first stage
        cy.get('[data-cy="edit-stage-button-0"]').click()
        cy.get('[data-cy="edit-stage-name-0"]').clear().type("Stage 1")
        cy.get('[data-cy="edit-stage-duration-0"]').clear().type("400")
        cy.get('[data-cy="edit-stage-save-0"]').click()

        // add element 2 in stage 1
        cy.get('[data-cy="add-element-button-0"]').click();
        cy.get('[data-cy="edit-element-name-0-new"]').type("Element 2");
        cy.get('[data-cy="edit-element-type-0-new"]').select("Survey");
        cy.get('[data-cy="edit-element-surveyName-0-new"]').select("TIPI");
        cy.get('[data-cy="edit-element-save-0-new"]').click();

        // add second stage
        cy.get('[data-cy="add-stage-button"]').click();
        cy.get('[data-cy="edit-stage-name-new"]').type("Stage 2");
        cy.get('[data-cy="edit-stage-duration-new"]').type("{backspace}200");
        cy.get('[data-cy="edit-stage-save-new"]').click();

        cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Stage 2").should("be.visible");
        cy.get('[data-cy="element-0-0"]').contains("testA").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");
    });

    it('allows reordering of elements within stage', () => {
        // verify initial order
        cy.get('[data-cy="element-0-0"]').contains("testA").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);

        // swap first element with second element
        cy.get('[data-cy="element-0-0"]')
            .focus()
            .type(" ") // space bar selects item to move
            .type("{downArrow}") // move element down one
            .type(" "); // stop moving item

        cy.wait(1000);

        // verify new order
        cy.get('[data-cy="element-0-0"]').contains("Element 2").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("testA").should("be.visible");
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);
    })

    it('allows reodering of stages', () => {
        // verify initial order
        cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Stage 2").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);

        // swap first stage with second stage
        cy.get('[data-cy="stage-0"]')
            .focus()
            .type(" ")
            .type("{rightArrow}") // move stage 1 to the right
            .type(" ");

        cy.wait(1000);

        // verify new order
        cy.get('[data-cy="stage-0"]').contains("Stage 2").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);
    })

    it('rejects dragging elements to invalid spots', () => {
        // verify initial order
        cy.get('[data-cy="element-0-0"]').contains("testA").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);

        // try moving first element from stage 1 to stage 2
        cy.get('[data-cy="element-0-0"]')
            .focus()
            .type(" ")
            .type("{rightArrow}")
            .type(" ");

        cy.wait(1000);

        // verify that order remains the same
        cy.get('[data-cy="element-0-0"]').contains("testA").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);

        // try moving second element outside of stage 1
        cy.get('[data-cy="element-0-1"]')
            .focus()
            .type(" ")
            .type("{rightArrow}")
            .type(" ");

        cy.wait(1000);

        // verify that order remains the same
        cy.get('[data-cy="element-0-0"]').contains("testA").should("be.visible");
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible");
        cy.get('[data-cy^="element-0-"]').should('have.length', 2);
    })

    it('rejects dragging stages outside of timeline', () => {
        // verify initial order
        cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Stage 2").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);

        // try dragging stage outside of timeline 
        cy.get('[data-cy="stage-0"]')
            .focus()
            .type(" ")
            .type("{upArrow}")
            .type(" ");

        cy.wait(1000);

        // verify that order remains the same
        cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Stage 2").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);
    })
})