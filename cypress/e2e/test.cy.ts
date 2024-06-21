// npm run cypress:open

describe('test spec', () => {
  it('passes', () => {
    // initial yaml code for treatment
    let yamltreatment = "name: cypress3_load_test\nplayerCount: 8\ngameStages:\n[]"

    cy.viewport(2000, 1000, { log: false });

    cy.visit('http://localhost:3000/editor')
    cy.get('[data-cy="code-editor"]').type(yamltreatment)
    cy.get('[data-cy="yaml-save"]').click()

    // create first stage
    cy.get('[data-cy="add-stage-button"]').click()
    cy.get('[data-cy="add-popup-name-addStage--"]').type("Stage 1")
    cy.get('[data-cy="add-popup-duration-addStage--"]').type("300")
    cy.get('[data-cy="add-popup-save-addStage--"]').click()

    cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible")

    // add first element to stage 1
    cy.get('[data-cy="add-element-button-0"]').click()
    cy.get('[data-cy="add-popup-name-addElement-0-"]').type("Element 1")
    cy.get('[data-cy="add-popup-type-addElement-0-"]').select("survey")
    cy.get('[data-cy="add-popup-save-addElement-0-"]').click()

    cy.get('[data-cy="element-0-0"]').contains("Survey").should("be.visible")
    cy.get('[data-cy="element-0-0"]').contains("Element 1").should("be.visible")

    // add second element to stage 1
    cy.get('[data-cy="add-element-button-0"]').click()
    cy.get('[data-cy="add-popup-name-addElement-0-"]').type("Element 2")
    cy.get('[data-cy="add-popup-type-addElement-0-"]').select("prompt")
    cy.get('[data-cy="add-popup-fileAddress-addElement-0-"]').type("file/address")
    cy.get('[data-cy="add-popup-save-addElement-0-"]').click()

    cy.get('[data-cy="element-0-0"]').contains("Survey").should("be.visible")
    cy.get('[data-cy="element-0-1"]').contains("Prompt").should("be.visible")
    cy.get('[data-cy="element-0-1"]').contains("file/address").should("be.visible")

    // create second stage
    cy.get('[data-cy="add-stage-button"]').click()
    cy.get('[data-cy="add-popup-name-addStage--"]').type("Stage 2")
    cy.get('[data-cy="add-popup-duration-addStage--"]').type("200")
    cy.get('[data-cy="add-popup-save-addStage--"]').click()

    cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible")
    cy.get('[data-cy="stage-1"]').contains("Stage 2").should("be.visible")

    // add third element to stage 2
    cy.get('[data-cy="add-element-button-1"]').click()
    cy.get('[data-cy="add-popup-name-addElement-1-"]').type("Element 3")
    cy.get('[data-cy="add-popup-type-addElement-1-"]').select("trainingVideo")
    cy.get('[data-cy="add-popup-URL-addElement-1-"]').type("youtube.com")
    cy.get('[data-cy="add-popup-save-addElement-1-"]').click()

    cy.get('[data-cy="element-1-0"]').contains("Training Video").should("be.visible")
    cy.get('[data-cy="element-1-0"]').contains("url").should("be.visible")

    // edit first element
    cy.get('[data-cy="edit-element-button-0-0"]').click()
    cy.get('[data-cy="add-popup-name-editElement-0-0"]').type(" Edited")
    cy.get('[data-cy="add-popup-onSubmit-editElement-0-0"]').clear().type("Thanks!")
    cy.get('[data-cy="add-popup-save-editElement-0-0"]').click()

    cy.get('[data-cy="element-0-0"]').contains("Survey").should("be.visible")
    cy.get('[data-cy="element-0-0"]').contains("Element 1 Edited").should("be.visible")

    // delete second element
    cy.get('[data-cy="edit-element-button-0-1"]').click()
    cy.get('[data-cy="add-popup-delete-editElement-0-1"]').click()

    cy.get('[data-cy="stage-0"]').should("not.contain", "Prompt")

    // add fourth element to second stage via code editor
    cy.get('[data-cy="code-editor"]').type("      - name: Element 4\n  type: prompt\nfile: file/address")
    cy.get('[data-cy="yaml-save"]').click()

    cy.get('[data-cy="code-editor"]').contains("- name: Element 4").should("be.visible")
    cy.get('[data-cy="element-1-1"]').contains("Prompt").should("be.visible")
    cy.get('[data-cy="element-1-1"]').contains("Element 4").should("be.visible")

    // add third stage via code editor
    cy.get('[data-cy="code-editor"]').type("\n{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}- name: Stage 3\n  duration: 300\nelements: []")
    cy.get('[data-cy="yaml-save"]').click()

    cy.get('[data-cy="code-editor"]').contains("- name: Stage 3").should("be.visible")
    cy.get('[data-cy="stage-2"]').contains("Stage 3").should("be.visible")

    // edit first stage
    cy.get('[data-cy="edit-stage-button-0"]').click()
    cy.get('[data-cy="add-popup-name-editStage-0-"]').type(" Edited")
    cy.get('[data-cy="add-popup-duration-editStage-0-"]').clear().type("400")
    cy.get('[data-cy="add-popup-save-editStage-0-"]').click()

    cy.get('[data-cy="stage-0"]').contains("Stage 1 Edited").should("be.visible")

    // delete second stage
    cy.get('[data-cy="edit-stage-button-2"]').click()
    cy.get('[data-cy="add-popup-delete-editStage-2-"]').click()

    cy.get('[data-cy="timeline"]').should("not.contain", "Stage 3")
  })
})