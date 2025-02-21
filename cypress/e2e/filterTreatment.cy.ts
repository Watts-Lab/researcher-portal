describe('timeline filter stages and treatments', () => {
    beforeEach(() => {
        // load initial treatment file
        let yamltreatment = "treatments:\n- name: treatment_one\n  playerCount: 1\ngameStages: []\n";
        cy.viewport(2000, 1000, { log: false });
        cy.visit('http://localhost:3000/editor');
        cy.clearCodeEditor();
        cy.typeInCodeEditor(`${yamltreatment}`) // equivalent to clear() in cypress
        cy.typeInCodeEditor(`{backspace}`);
        let secondTreatment = "- name: treatment_two\n  playerCount: 1\ngameStages: []\n";
        cy.typeInCodeEditor(`${secondTreatment}`);

        // save treatment file
        cy.containsInCodeEditor('treatment_one')
        cy.get('[data-cy="yaml-save"]').realClick()

        // ensure that the default treatment (treatment 0) is selected when the page is loaded
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '0');

        // treatment one, first stage
        cy.get('[data-cy="add-stage-button"]').realClick();
        cy.get('[data-cy="edit-stage-name-new"]').should('exist').type("Role Assignment and General Instructions");
        cy.get('[data-cy="edit-stage-duration-new"]').should('exist').type("{backspace}300");
        cy.get('[data-cy="edit-stage-save-new"]').realClick();

        // treatment one, second stage
        cy.get('[data-cy="add-stage-button"]').realClick();
        cy.get('[data-cy="edit-stage-name-new"]').should('exist').type("Main Discussion");
        cy.get('[data-cy="edit-stage-duration-new"]').should('exist').type("{backspace}200");
        cy.get('[data-cy="edit-stage-save-new"]').realClick();

        // switch to the second treatment
        cy.get('[data-cy="treatments-dropdown"] select').select('1');
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '1');

        // treatment two, first stage
        cy.get('[data-cy="add-stage-button"]').realClick();
        cy.get('[data-cy="edit-stage-name-new"]').should('exist').type("test");
        cy.get('[data-cy="edit-stage-duration-new"]').should('exist').type("{backspace}200");
        cy.get('[data-cy="edit-stage-save-new"]').realClick();

        // treatment two, second stage
        cy.get('[data-cy="add-stage-button"]').realClick();
        cy.get('[data-cy="edit-stage-name-new"]').should('exist').type("test2");
        cy.get('[data-cy="edit-stage-duration-new"]').should('exist').type("{backspace}200");
        cy.get('[data-cy="edit-stage-save-new"]').realClick();

        // verify all stages in second treatment are visible
        cy.get('[data-cy="stage-0"]').contains("test").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("test2").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);

        // switch back to first treatment
        cy.get('[data-cy="treatments-dropdown"] select').select('0');
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '0');

        // all stages in treatment 0 should initially be visible
        cy.get('[data-cy="stage-0"]').contains("Role Assignment and General Instructions").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);
    });

    it('should dynamically populate stage options in stages dropdown', () => {
        cy.get('[data-cy="stages-dropdown"] select').within(() => {
            cy.get('option').should('have.length', 3);
            cy.get('option').eq(0).should('have.text', 'All Stages');
            cy.get('option').eq(1).should('have.text', 'Role Assignment and General Instructions');
            cy.get('option').eq(2).should('have.text', 'Main Discussion');
        });
    })

    it('should dynamically populate treatment options in treatments dropdown', () => {
        cy.get('[data-cy="treatments-dropdown"] select').within(() => {
            cy.get('option').should('have.length', 2);
            cy.get('option').eq(0).should('have.text', 'treatment_one');
            cy.get('option').eq(1).should('have.text', 'treatment_two');
        });
    })

    it('allows filtering by stage name', () => {
        // default option
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'all');

        // select one stage and ensure no other stages are visible (assuming all stages have different names)
        cy.get('[data-cy="stages-dropdown"] select').select('Main Discussion');
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'Main Discussion');
        cy.get('[data-cy="stage-0"]').should('not.exist');
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 1);

        // verify that currentStageIndex in context and currentStageName in localStorage are correct after stage change
        cy.window().its('stageContext').then((stageContext) => {
            expect(stageContext.currentStageIndex).to.equal(1);
        });
        cy.window().then((win) => {
            expect(win.localStorage.getItem('currentStageName')).to.equal('Main Discussion');
        });

        // reset to all stages when filter option is cleared
        cy.get('[data-cy="stages-dropdown"] select').select('all');
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'all');
        cy.get('[data-cy="stage-0"]').contains("Role Assignment and General Instructions").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);

        // verify that currentStageIndex and currentStageName are reset after clearing filter
        cy.window().its('stageContext').then((stageContext) => {
            expect(stageContext.currentStageIndex).to.equal(0);
        });
        cy.window().then((win) => {
            expect(win.localStorage.getItem('currentStageName')).to.equal('all');
        });
    })

    it('allows filtering by treatment name', () => {
        // Select the second treatment
        cy.get('[data-cy="treatments-dropdown"] select').select('1');
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '1');

        // Verify that selectedTreatmentIndex in both context and localStorage is correct
        cy.window().its('stageContext').then((stageContext) => {
            expect(stageContext.selectedTreatmentIndex).to.equal(1);
        });
        cy.window().then((win) => {
            expect(win.localStorage.getItem('selectedTreatmentIndex')).to.equal('1');
        });

        // Verify that the stages for the second treatment are displayed
        cy.get('[data-cy="stage-0"]').contains("test").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("test2").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);

        // Verify that selecting stages works in second treatment
        cy.get('[data-cy="stages-dropdown"] select').select('test2');
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'test2');
        cy.get('[data-cy="stage-0"]').should('not.exist');
        cy.get('[data-cy="stage-1"]').contains("test").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 1);

        // Verify that currentStageIndex in context and currentStageName in localStorage are correct after stage change
        cy.window().its('stageContext').then((stageContext) => {
            expect(stageContext.currentStageIndex).to.equal(1);
        });
        cy.window().then((win) => {
            expect(win.localStorage.getItem('currentStageName')).to.equal('test2');
        });

        // Switch back to the first treatment
        cy.get('[data-cy="treatments-dropdown"] select').select('0');
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '0');

        // Verify that the selectedTreatmentIndex in context and localStorage is correct
        cy.window().its('stageContext').then((stageContext) => {
            expect(stageContext.selectedTreatmentIndex).to.equal(0);
        });
        cy.window().then((win) => {
            expect(win.localStorage.getItem('selectedTreatmentIndex')).to.equal('0');
        });

        // Verify that currentStageIndex and currentStageName are reset after switching treatments
        cy.window().its('stageContext').then((stageContext) => {
            expect(stageContext.currentStageIndex).to.equal(0);
        });
        cy.window().then((win) => {
            expect(win.localStorage.getItem('currentStageName')).to.equal('all');
        });

        // Verify that the stages for the first treatment are displayed
        cy.get('[data-cy="stage-0"]').contains("Role Assignment and General Instructions").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);
    })

    it('should persist selected stage after page reload', () => {
        // Initial stage
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'all');

        // Select a new stage
        cy.get('[data-cy="stages-dropdown"] select').select('Main Discussion');
        cy.get('[data-cy="stage-0"]').should('not.exist');
        cy.get('[data-cy="stage-2"]').should('not.exist');
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 1);

        cy.reload(); // reload page

        // Verify that stage selection persists
        cy.get('[data-cy="stages-dropdown"] select').should('have.value', 'Main Discussion');
        cy.get('[data-cy="stage-0"]').should('not.exist');
        cy.get('[data-cy="stage-2"]').should('not.exist');
        cy.get('[data-cy="stage-1"]').contains("Main Discussion").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 1);
    })

    it('should persist selected treatment after page reload', () => {
        // Initial treatment
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '0');

        // Select a new treatment and verify timeline contents
        cy.get('[data-cy="treatments-dropdown"] select').select('1');
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '1');
        cy.get('[data-cy="stage-0"]').contains("test").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("test2").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);

        cy.reload(); // reload page

        // Verify that timeline persists
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '1');
        cy.get('[data-cy="stage-0"]').contains("test").should("be.visible");
        cy.get('[data-cy="stage-1"]').contains("test2").should("be.visible");
        cy.get('[data-cy^="stage-"]').should('have.length', 2);
    })

    it('should show a useful message when stages array is empty', () => {
        // Add a treatment with an empty stages array
        cy.typeInCodeEditor(`\n`);
        cy.typeInCodeEditor(` `);
        cy.typeInCodeEditor(` `);
        let emptyStagesTreatment = "- name: treatment_three\n  playerCount: 1\ngameStages: []\n";
        cy.typeInCodeEditor(`${emptyStagesTreatment}`);
        cy.get('[data-cy="yaml-save"]').realClick();

        // Select the treatment with empty stages
        cy.get('[data-cy="treatments-dropdown"] select').select('2');
        cy.get('[data-cy="treatments-dropdown"] select').should('have.value', '2');

        // Verify the message
        cy.get('[data-cy="stages-dropdown"] select').should('contain', 'Nothing available');
    })

    it('should show a useful message when treatments array is empty', () => {
        // Load an empty treatments array
        let emptyTreatments = "treatments: []\n";
        cy.clearCodeEditor();
        cy.typeInCodeEditor(`${emptyTreatments}`);
        cy.get('[data-cy="yaml-save"]').realClick();

        // Verify the messages
        cy.get('[data-cy="treatments-dropdown"] select').should('contain', 'Nothing available');
    })
})