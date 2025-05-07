// npm run cypress:open

describe('test spec', () => {
        it('passes', () => {

                // initial yaml code for treatment, including a survey element
                let yamltreatment = "treatments: {enter}- name: mock_player_test{enter}  playerCount: 1{enter}gameStages: {enter}- name: test_mock_player{enter}  duration: 60{enter}elements:{enter}- name: test_survey{enter}  type: survey{enter}surveyName: ConflictAndViability"

                cy.viewport(2000, 1000, { log: false });

                cy.visit('http://localhost:3000/editor')
                cy.clearCodeEditor()
                cy.typeInCodeEditor(`${yamltreatment}`) // equivalent to clear() in cypress

                // verify initial text in editor

                // text values from monaco-editor will include line numbers and no line breaks
                // the yamltreatment variable has no line numbers and line breaks
                // so right now comparison is only on the treatmentName
                cy.containsInCodeEditor('mock_player_test')
                cy.get('[data-cy="yaml-save"]').click()

                // click on survey questions and complete survey
                cy.contains('Please answer the following questions').should('exist')
                //cy.contains('1').click({force: true})
                cy.get('input[type="radio"]').should("have.value", "1").click({ force: true, multiple: true })
                // cy.get('input[id="sq_106i_0"]').click({force: true})
                // cy.get('input[id="sq_107i_0"]').click({force: true})
                // cy.get('input[id="sq_108i_0"]').click({force: true})
                // cy.get('input[id="sq_109i_0"]').click({force: true})
                cy.get('input[title="Complete"]').click()

                // survey should not be visible and no error should be thrown
                cy.contains('Please answer the following questions').should('not.exist')

        })
})