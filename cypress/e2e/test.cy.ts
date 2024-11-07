import { createPublicKey } from "crypto";

// npm run cypress:open
describe('test spec', () => {
    it('passes', () => {

        // TO ADD: check for warning messages when invalid input is entered

        // initial yaml code for treatment
        let yamltreatment = "treatments: {enter}- name: cypress3_load_test{enter}  playerCount: 1{enter}gameStages: []{enter}"

        cy.viewport(2000, 1000, { log: false });

        cy.visit('http://localhost:3000/editor')
        cy.typeInCodeEditor(`{ctrl+a}{del}${yamltreatment}`) // equivalent to clear() in cypress

        // verify initial text in editor

        // text values from monaco-editor will include line numbers and no line breaks
        // the yamltreatment variable has no line numbers and line breaks
        // so right now comparison is only on the treatmentName
        cy.containsInCodeEditor('cypress3_load_test')
        cy.get('[data-cy="code-editor-save"]').realClick()

        // // view template in render panel
        // cy.get('[data-cy="render-panel"]').contains("Click on a stage card to preview the stage from a participant view.").should("be.visible")
        // cy.get('[data-cy="stage-0"]').click(0, 0)
        // cy.get('[data-cy="render-panel"]').contains("Click on a stage card to preview the stage from a participant view.").should("not.exist")
        // cy.get('[data-cy="render-panel"]').contains("strong magical field").should("be.visible")

        // create first stage
        cy.get('[data-cy="add-stage-button"]').click()
        cy.get('[data-cy="edit-stage-name-new"]').type("Stage 1")
        cy.get('[data-cy="edit-stage-duration-new"]').type("{backspace}300")
        cy.get('[data-cy="edit-stage-save-new"]').click()

        cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible")

        // add first element to stage 1
        cy.get('[data-cy="add-element-button-0"]').click()
        cy.get('[data-cy="edit-element-name-0-new"]').type("Element 1")
        cy.get('[data-cy="edit-element-type-0-new"]').select("Prompt")
        cy.get('[data-cy="edit-element-file-0-new"]').type("projects/example/preDiscussionInstructions.md")
        cy.get('[data-cy="edit-element-save-0-new"]').click()

        cy.get('[data-cy="element-0-0"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-0-0"]').contains("Element 1").should("be.visible")

        // add second element to stage 1
        cy.get('[data-cy="add-element-button-0"]').click()
        cy.get('[data-cy="edit-element-name-0-new"]').type("Element 2")
        cy.get('[data-cy="edit-element-type-0-new"]').select("Prompt")
        cy.get('[data-cy="edit-element-file-0-new"]').type("projects/example/preDiscussionInstructions.md")
        cy.get('[data-cy="edit-element-save-0-new"]').click()

        cy.get('[data-cy="element-0-1"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible")

        // add third element to stage 1
        cy.get('[data-cy="add-element-button-0"]').click()
        cy.get('[data-cy="edit-element-name-0-new"]').type("Element 3")
        cy.get('[data-cy="edit-element-type-0-new"]').select("Survey")
        cy.get('[data-cy="edit-element-surveyName-0-new"]').select("TIPI")
        cy.get('[data-cy="edit-element-save-0-new"]').click()

        cy.get('[data-cy="element-0-1"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-0-2"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-2"]').contains("TIPI").should("be.visible")

        // edit first stage
        cy.get('[data-cy="edit-stage-button-0"]').click()
        cy.get('[data-cy="edit-stage-name-0"]').clear().type("Stage 1 Edited")
        cy.get('[data-cy="edit-stage-duration-0"]').clear().type("400")
        cy.get('[data-cy="edit-stage-save-0"]').click()

        cy.get('[data-cy="stage-0"]').contains("Stage 1 Edited").should("be.visible")

        // view first stage in render panel
        // TODO check if needed
        // cy.get('[data-cy="render-panel"]').contains("Click on a stage card to preview the stage from a participant view.").should("be.visible")
        cy.get('[data-cy="stage-0"]').click(0, 0)
        cy.wait(2000)
        cy.get('[data-cy="render-panel"]').contains("Click on a stage card to preview the stage from a participant view.").should("not.exist")
        // TODO check if needed
        // cy.get('[data-cy="render-panel"]').contains("strong magical field").should("be.visible")
        cy.get('[data-cy="render-panel"]').contains("Here are a number of personality traits").should("be.visible")

        // create second stage
        cy.get('[data-cy="add-stage-button"]').click()
        cy.get('[data-cy="edit-stage-name-new"]').type("Stage 2")
        cy.get('[data-cy="edit-stage-duration-new"]').type("{backspace}200")
        cy.get('[data-cy="edit-stage-save-new"]').click()

        cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible")
        cy.get('[data-cy="stage-1"]').contains("Stage 2").should("be.visible")

        // add third element to stage 2
        cy.get('[data-cy="add-element-button-1"]').click()
        cy.get('[data-cy="edit-element-name-1-new"]').type("Element 3")
        cy.get('[data-cy="edit-element-type-1-new"]').select("Training Video")
        cy.get('[data-cy="edit-element-url-1-new"]').type("https://www.youtube.com/")
        cy.get('[data-cy="edit-element-save-1-new"]').click()

        cy.get('[data-cy="element-1-0"]').contains("video").should("be.visible")
        cy.get('[data-cy="element-1-0"]').contains("https://www.youtube.com/").should("be.visible")

        // view second stage in render panel
        cy.get('[data-cy="stage-1"]').click(0, 0)
        cy.get('[data-cy="render-panel"]').contains("Click on a stage card to preview the stage from a participant view.").should("not.exist")
        cy.get('[data-cy="render-panel"]').contains("Click to continue the video").should("be.visible")

        // edit second element in first stage
        cy.get('[data-cy="edit-element-button-0-1"]').click()
        cy.get('[data-cy="edit-element-name-0-1"]').should("have.value", "Element 2").should("be.visible").type(" Edited")
        cy.get('[data-cy="edit-element-file-0-1"]').type("projects/example/discussionInstructions.md")
        cy.get('[data-cy="edit-element-save-0-1"]').click()

        cy.get('[data-cy="element-0-1"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2 Edited").should("be.visible")

        // delete third element in first stage
        cy.get('[data-cy="edit-element-button-0-2"]').click()
        cy.get('[data-cy="edit-element-delete-0-2"]').click()

        cy.get('[data-cy="stage-0"]').should("not.contain", "Element 3")

        // add fourth element to second stage via code editor
        cy.typeInCodeEditor("{moveToEnd}{enter}{home}          - name: Element 4 {enter}  type: prompt {enter}file: file/address")
        cy.get('[data-cy="code-editor-save"]').click()

        cy.containsInCodeEditor("name: Element 4")
        cy.get('[data-cy="element-1-1"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-1-1"]').contains("Element 4").should("be.visible")

        // add third stage via code editor
        cy.typeInCodeEditor("{moveToEnd}{enter}{home}      - name: Stage 3 {enter}  duration: 300 {enter}elements: []")
        cy.get('[data-cy="code-editor-save"]').click()

        cy.containsInCodeEditor("name: Stage 3")
        cy.get('[data-cy="stage-2"]').should('exist')

        // delete third stage
        cy.get('[data-cy="edit-stage-button-2"]').click()
        cy.get('[data-cy="edit-stage-delete-2"]').click()
        cy.on('window:confirm', () => true);

        cy.get('[data-cy="timeline"]').should("not.contain", "Stage 3")
    })
})