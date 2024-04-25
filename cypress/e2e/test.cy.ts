describe('test spec', () => {
  it('passes', () => {
    // initial yaml code for treatment
    let yamltreatment = "name: cypress3_load_test\nplayerCount: 8\ngameStages:\n[]"
    cy.visit('http://localhost:3000/editor')
    cy.get('[data-cy="code-editor"]').type(yamltreatment)
    cy.get('[data-cy="yaml-save"]').click()

    // TODO: ADD ASSERTIONS !!

    // create first stage
    cy.get('[data-cy="add-stage-button"]').click()
    cy.get('[data-cy="add-popup-name-addStage--"]').type("Stage 1")
    cy.get('[data-cy="add-popup-duration-addStage--"]').type("300")
    cy.get('[data-cy="add-popup-save-addStage--"]').click()

    // add first element to stage 1
    cy.get('[data-cy="add-element-button-0"]').click()
    cy.get('[data-cy="add-popup-name-addElement-0-"]').type("Element 1")
    cy.get('[data-cy="add-popup-type-addElement-0-"]').select("survey")
    cy.get('[data-cy="add-popup-onSubmit-addElement-0-"]').type("Thanks!")
    cy.get('[data-cy="add-popup-save-addElement-0-"]').click()

    // add second element to stage 1
    cy.get('[data-cy="add-element-button-0"]').click()
    cy.get('[data-cy="add-popup-name-addElement-0-"]').type("Element 2")
    cy.get('[data-cy="add-popup-type-addElement-0-"]').select("prompt")
    cy.get('[data-cy="add-popup-fileAddress-addElement-0-"]').type("file/address")
    cy.get('[data-cy="add-popup-save-addElement-0-"]').click()

    // create second stage
    cy.get('[data-cy="add-stage-button"]').click()
    cy.get('[data-cy="add-popup-name-addStage--"]').type("Stage 2")
    cy.get('[data-cy="add-popup-duration-addStage--"]').type("200")
    cy.get('[data-cy="add-popup-save-addStage--"]').click()

    // add third element to stage 2
    cy.get('[data-cy="add-element-button-1"]').click()
    cy.get('[data-cy="add-popup-name-addElement-1-"]').type("Element 3")
    cy.get('[data-cy="add-popup-type-addElement-1-"]').select("trainingVideo")
    cy.get('[data-cy="add-popup-URL-addElement-1-"]').type("youtube.com")
    cy.get('[data-cy="add-popup-save-addElement-1-"]').click()

    // edit first element
    cy.get('[data-cy="edit-element-button-0-0"]').click()
    cy.get('[data-cy="add-popup-name-editElement-0-0"]').type("{moveToStart}Edited ")
    cy.get('[data-cy="add-popup-onSubmit-editElement-0-0"]').clear().type("Thanks!")
    cy.get('[data-cy="add-popup-save-editElement-0-0"]').click()

    // delete second element
    cy.get('[data-cy="edit-element-button-0-1"]').click()
    cy.get('[data-cy="add-popup-delete-editElement-0-1"]').click()

    // add fourth element to second stage via code editor
    cy.get('[data-cy="code-editor"]').type("      - name: Element 4\n  type: prompt\nfile: file/address")
    cy.get('[data-cy="yaml-save"]').click()

    // edit first stage
    cy.get('[data-cy="edit-stage-button-0"]').click()
    cy.get('[data-cy="add-popup-name-editStage-0-"]').type("{moveToStart}Edited ")
    cy.get('[data-cy="add-popup-duration-editStage-0-"]').clear().type("400")
    cy.get('[data-cy="add-popup-save-editStage-0-"]').click()

    // delete second stage
    cy.get('[data-cy="edit-stage-button-1"]').click()
    cy.get('[data-cy="add-popup-delete-editStage-1-"]').click()

  })
})