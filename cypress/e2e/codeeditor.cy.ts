// npm run cypress:open

import { keyCodeDefinitions } from "node_modules/cypress-real-events/keyCodeDefinitions";

function setInitialTreatment(appendTreatmentTextWith: string = '') {
    // initial yaml treatment
    let yamltreatment = `treatments: {enter}- name: cypress_code_editor_test \n  playerCount: 1 \ngameStages: {enter}{home}        - name: Stage 1 \n  duration: 100 \nelements: {enter}{home}            - name: Element 1 \n  type: survey \nsurveyName: CRT ${appendTreatmentTextWith}`
    cy.clearCodeEditor()
    cy.typeInCodeEditor(`${yamltreatment}`) // equivalent to clear() in cypress

    // verify initial text in editor

    // text values from monaco-editor will include line numbers and no line breaks
    // the yamltreatment variable has no line numbers and line breaks
    // so right now comparison is only on the treatmentName
    cy.containsInCodeEditor('cypress_code_editor_test')
    cy.get('[data-cy="yaml-save"]').realClick()
}

describe('code editor', () => {
    beforeEach(() => {
        cy.viewport(2000, 1000, { log: false });

        cy.visit('http://localhost:3000/editor')
        cy.clearCodeEditor()
    });

    it('reflects code editor changes in stage cards', () => {
        // add new element using code editor
        setInitialTreatment("{enter}{backspace}{backspace}  - name: Element 2\n  type: prompt \nfile: projects/example/preDiscussionInstructions.md")

        // verify changes in code editor
        cy.containsInCodeEditor("name: Element 2")

        // verify changes in stage cards
        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="element-0-1"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible")
    })

    it('reflects stage card changes in editor', () => {
        setInitialTreatment()

        // add new element using stage cards
        cy.get('[data-cy="add-element-button-0"]').click()
        cy.get('[data-cy="edit-element-name-0-new"]').type("Element 2")
        cy.get('[data-cy="edit-element-type-0-new"]').select("Survey")
        cy.get('[data-cy="edit-element-surveyName-0-new"]').select("TIPI")
        cy.get('[data-cy="edit-element-save-0-new"]').click()

        // verify changes in stage cards
        cy.get('[data-cy="element-0-1"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("TIPI").should("be.visible")

        // verify changes in code editor
        cy.containsInCodeEditor("name: Element 2")
    })


    it('does not save when yaml is improperly formatted', () => {
        setInitialTreatment("{enter}{home}            name: Element 2\n  type: survey\nsurveyName: CRT")

        // verify text is updated in editor but no change in stage cards
        cy.containsInCodeEditor("name: Element 2")
        cy.get('[data-cy="element-0-1"]').should('not.exist')

        // correct mistake and save
        setInitialTreatment("{enter}{home}            - name: Element 2\n  type: survey \nsurveyName: CRT")


        // verify text is updated in editor and in stage cards
        cy.containsInCodeEditor("name: Element 2")
        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="element-0-0"]').should('exist')
        cy.get('[data-cy="element-0-1"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible")
    })

    it('does not save when treatment (stage) is improperly formatted', () => {
        // add poorly formatted stage using code editor
        setInitialTreatment(`{enter}{home}        - name: Stage 2 \n  duration: 300 \nelements: error`)

        // verify text is updated in editor but no change in stage cards
        cy.containsInCodeEditor("name: Stage 2")
        cy.get('[data-cy="stage-1"]').should('not.exist')

        // correct mistake and save
        setInitialTreatment(`{enter}{home}        - name: Stage 2 \n  duration: 300 \nelements: \n- name: Element 2 \n  type: survey \nsurveyName: CRT`)

        // verify text is updated in editor and in stage cards
        cy.containsInCodeEditor("name: Stage 2")
        cy.get('[data-cy="stage-1"]').should('exist')
        cy.get('[data-cy="element-1-0"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-1-0"]').contains("Element 2").should("be.visible")
    })

    it('does not save when treatment (element) is improperly formatted', () => {
        // add poorly formatted element using code editor
        setInitialTreatment(`{enter}{home}            - name: Element 2`)

        // verify text is updated in editor but no change in stage cards
        cy.containsInCodeEditor("name: Element 2")
        cy.get('[data-cy="element-0-1"]').should('not.exist')

        // correct mistake and save
        setInitialTreatment(`{enter}{home}            - name: Element 2\n  type: survey \nsurveyName: CRT`)

        // verify text is updated in editor and in stage cards
        cy.containsInCodeEditor("name: Element 2")
        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="element-0-1"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible")
    })

    it('saves when treatment (element) is an empty array', () => {
        // add stage with elements: [] using code editor
        setInitialTreatment(`{enter}{home}        - name: Stage 2 \n  duration: 300 \nelements: []`)

        // verify text is updated in editor and in stage cards
        cy.containsInCodeEditor("name: Stage 2")
        cy.get('[data-cy="stage-1"]').should('exist')
        cy.get('[data-cy="element-1-0"]').should("not.exist")
    })


})