describe('test spec', () => {
    it('passes', () => {

        // initial yaml code for treatment, including a survey element
        let yamltreatment = `treatments: {enter}- name: mock_timer_test \n  playerCount: 1 \ngameStages:{enter}- name: TestTemplateA\n  duration: 60\nelements:\n  - template: testA{enter}{home}`

        cy.viewport(2000, 1000, { log: false });
        cy.visit('http://localhost:3000/editor')
        cy.typeInCodeEditor(`{ctrl+a}{del}${yamltreatment}`) // equivalent to clear() in cypress

        // verify initial text in editor

        // text values from monaco-editor will include line numbers and no line breaks
        // the yamltreatment variable has no line numbers and line breaks
        // so right now comparison is only on the treatmentName
        cy.containsInCodeEditor('mock_timer_test')
        cy.get('[data-cy="yaml-save"]').realClick()
        cy.wait(3000)

        // Check that time-picker value is greater than 0
        cy.get('[data-test="time-picker"]')
            .invoke('val')
            .then(Number)
            .should('be.greaterThan', 0)

        // Set new timer value
        cy.get('[data-test="time-picker"]')
            .invoke('val', 50)
            .trigger('input');

        // Verify that the timer value is bigger
        cy.get('[data-test="time-picker"]')
            .invoke('val')
            .then(Number)
            .should('be.greaterThan', 49);

        cy.wait(3000)
        cy.get('[data-test="time-picker"]')
            .invoke('val')
            .then(Number)
            .should('be.greaterThan', 52);
            
        // Set timer value to 60 and make sure it's capped at 60
        cy.get('[data-test="time-picker"]')
            .invoke('val', 60)
            .trigger('input');

        cy.wait(3000)
        cy.get('[data-test="time-picker"]')
            .invoke('val')
            .then(Number)
            .should('equal', 60);
    })
})