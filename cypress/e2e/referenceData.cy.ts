
describe('test spec', () => {
  it('passes', () => {

    // initial yaml code for treatment, including a survey element 
    let yamltreatment = "treatments: {enter}- name: no_refs_stage{enter}  playerCount: 1{enter}gameStages: {enter}- name: test_no_refs_stage{enter}  duration: 60{enter}elements:{enter}- name: test_element{enter}  type: prompt \nfile: projects/example/preDiscussionInstructions.md"

    cy.viewport(2000, 1000, { log: false });
    cy.visit('http://localhost:3000/editor')
    //  cmd for mac
    cy.typeInCodeEditor(`{ctrl+a}{del}${yamltreatment}`)


    cy.containsInCodeEditor('no_refs_stage')
    cy.get('[data-cy="yaml-save"]').click()

    // test confirm the stage title
    cy.contains('[data-cy="stage-title"]', 'Stage Refs and Dependencies')
      .should('exist')

    // "No references found"
    cy.contains('[data-cy="no-references-message"]', 'No references found')
      .should('exist')
  })


  it('shows references if present and allows saving', () => {
    let yamltreatmentWithRefs = "treatments: {enter}- name: no_refs_stage{enter}  playerCount: 1{enter}gameStages: {enter}- name: test_no_refs_stage{enter}  duration: 60{enter}elements:{enter}- type: display\n  reference: participantInfo.name\nfile: projects/example/preDiscussionInstructions.md"

    cy.viewport(2000, 1000, { log: false });
    cy.visit('http://localhost:3000/editor')

    cy.typeInCodeEditor(`{ctrl+a}{del}${yamltreatmentWithRefs}`)

    cy.get('[data-cy="yaml-save"]').click()

    // make sure the component loads with references
    cy.contains('[data-cy="stage-title"]', 'Stage Refs and Dependencies')
      .should('exist')

    // check that we do NOT see "No references found"
    cy.get('[data-cy="no-references-message"]').should('not.exist')

    // For the reference "participantInfo.name", the label should appear
    cy.get('[data-cy="reference-label-participantInfo.name"]')
      .should('contain', 'ParticipantInfo: Name')

    //  input should exist & have placeholder matching the last part 
    cy.get('[data-cy="reference-input-participantInfo.name"]')
      .should('have.attr', 'placeholder', 'Enter value for Name')
      .type('Hello from Cypress')
      .should('have.value', 'Hello from Cypress')

    cy.get('[data-cy="save-button"]').click()
    cy.get('[data-cy="reference-display-participantInfo.name"]')
      .should('contain', 'Saved Value: Hello from Cypress')
  })


  it('handles multiple references and saves to localStorage', () => {
    // two references: participantInfo.name & participantInfo.age
    let yamltreatmentWithMultipleRefs = "treatments: {enter}- name: no_refs_stage{enter}  playerCount: 1{enter}gameStages: {enter}- name: test_no_refs_stage{enter}  duration: 60{enter}elements:{enter}- type: display\n  reference: participantInfo.name\nfile: projects/example/preDiscussionInstructions.md{enter}{backspace}- type: display\n  reference: participantInfo.age\nfile: projects/example/hi.md"

    cy.viewport(2000, 1000, { log: false });
    cy.visit('http://localhost:3000/editor');

    cy.typeInCodeEditor(`{ctrl+a}{del}${yamltreatmentWithMultipleRefs}`);

    cy.get('[data-cy="yaml-save"]').click();

    // confirm the references exist
    cy.get('[data-cy="reference-label-participantInfo.name"]')
      .should('contain', 'ParticipantInfo: Name');

    cy.get('[data-cy="reference-label-participantInfo.age"]')
      .should('contain', 'ParticipantInfo: Age');

    cy.get('[data-cy="reference-input-participantInfo.name"]')
      .type('Jane Doe')
      .should('have.value', 'Jane Doe');

    cy.get('[data-cy="reference-input-participantInfo.age"]')
      .type('30')
      .should('have.value', '30');

    cy.get('[data-cy="save-button"]').click();

    //confirm saved values displayed
    cy.get('[data-cy="reference-display-participantInfo.name"]')
      .should('contain', 'Saved Value: Jane Doe');

    cy.get('[data-cy="reference-display-participantInfo.age"]')
      .should('contain', 'Saved Value: 30');

    cy.get('[data-cy="save-button"]').click();
  });

});
