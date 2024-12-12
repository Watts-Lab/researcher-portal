describe('timeline filter treatment', () => {
    beforeEach(() => {
        // load initial treatment file
        let yamltreatment = "treatments: \n - name: filter_timeline_test\n  playerCount: 1\ngameStages: []";
        cy.viewport(2000, 1000, { log: false });
        cy.visit('http://localhost:3000/editor');
        cy.typeInCodeEditor(`{ctrl+a}{del}${yamltreatment}`) // equivalent to clear() in cypress

        // verify initial text in editor

        // text values from monaco-editor will include line numbers and no line breaks
        // the yamltreatment variable has no line numbers and line breaks
        // so right now comparison is only on the treatmentName
        cy.containsInCodeEditor('filter_timeline_test')
        cy.get('[data-cy="yaml-save"]').realClick()

        // first stage
        cy.get('[data-cy="add-stage-button"]').click();
        cy.get('[data-cy="edit-stage-name-new"]').type("Role Assignment and General Instructions");
        cy.get('[data-cy="edit-stage-duration-new"]').type("{backspace}300");
        cy.get('[data-cy="edit-stage-save-new"]').click();

        // second stage
        cy.get('[data-cy="add-stage-button"]').click();
        cy.get('[data-cy="edit-stage-name-new"]').type("Main Discussion");
        cy.get('[data-cy="edit-stage-duration-new"]').type("{backspace}200");
        cy.get('[data-cy="edit-stage-save-new"]').click();

        // third stage
        cy.get('[data-cy="add-stage-button"]').click();
        cy.get('[data-cy="edit-stage-name-new"]').type("Post Discussion Survey");
        cy.get('[data-cy="edit-stage-duration-new"]').type("{backspace}200");
        cy.get('[data-cy="edit-stage-save-new"]').click();

        // all sections should initially be visible
        cy.get('[data-cy="stage-0"]').contains("Role Assignment and General Instructions").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy="stage-2"]').contains("Post Discussion Survey").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 3);
    });

    it('should dynamically populate filter options based on treatment file', () => {
        cy.get('[data-cy="stages-dropdown"] select').within(() => {
            cy.get('option').should('have.length', 4);
            cy.get('option').eq(0).should('have.text', 'All Stages');
            cy.get('option').eq(1).should('have.text', 'Role Assignment and General Instructions');
            cy.get('option').eq(2).should('have.text', 'Main Discussion');
            cy.get('option').eq(3).should('have.text', 'Post Discussion Survey');
        });
    })

    it('allows filtering stages by criteria', () => {
        // default option
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'all');

        // select one section and ensure no other sections are visible
        cy.get('[data-cy="stages-dropdown"] select').select('Main Discussion');
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'Main Discussion');
        cy.get('[data-cy="stage-0"]').should('not.exist');
        cy.get('[data-cy="stage-2"]').should('not.exist');
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 1);

        // reset to all stages when filter option is cleared
        cy.get('[data-cy="stages-dropdown"] select').select('all');
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'all');
        cy.get('[data-cy="stage-0"]').contains("Role Assignment and General Instructions").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy="stage-2"]').contains("Post Discussion Survey").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 3);
    })

    it('should persist selected filter after page reload', () => {
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'all');

        cy.get('[data-cy="stages-dropdown"] select').select('Main Discussion');
        cy.get('[data-cy="stage-0"]').should('not.exist');
        cy.get('[data-cy="stage-2"]').should('not.exist');
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 1);

        cy.reload(); // reload page

        cy.get('[data-cy="stages-dropdown"] select').select('Main Discussion');
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'Main Discussion');
        cy.get('[data-cy="stage-0"]').should('not.exist');
        cy.get('[data-cy="stage-2"]').should('not.exist');
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 1);
    })

    // add test for same named stages

    // make sure stageIndex is updated
})