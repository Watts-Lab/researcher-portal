
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
    cy.contains('[data-cy="stagerefs-title"]', 'Stage Refs and Dependencies')
      .should('exist')

    // "No references found"
    cy.contains('[data-cy="no-references-message"]', 'No references found')
      .should('exist')
  })


});
