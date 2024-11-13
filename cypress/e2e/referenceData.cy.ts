describe('ReferenceData Component - Input and Save References', () => {
  beforeEach(() => {
    // initial test yaml
    let yamlTreatment = `
          name: reference_test
          playerCount: 1
          gameStages:
            - name: Stage 1
              elements:
                - type: display
                  reference: participantInfo.name
                - type: display
                  reference: participantInfo.age
      `;

    // viewport & visit editor page
    cy.viewport(2000, 1000);
    cy.visit('http://localhost:3000/editor');

    // entering YAML treatment into code editor & save
    cy.get('[data-cy="code-editor"]').clear().type(yamlTreatment);
    cy.get('[data-cy="yaml-save"]').click();

    cy.get('[data-cy="stage-title"]', { timeout: 10000 }).should("be.visible");

    // verifying stage & elements are added successfully
    cy.get('[data-cy="stage-title"]').should("be.visible");
    cy.get('[data-cy="reference-label-participantInfo.name"]').contains("Participant Info: Name").should("be.visible");
    cy.get('[data-cy="reference-label-participantInfo.age"]').contains("Participant Info: Age").should("be.visible");
  });

  it('allows input of reference values, saves, and displays them correctly', () => {
    const nameValue = 'Alice';
    const ageValue = '30';

    // type values into input fields for each reference
    cy.get('[data-cy="reference-input-participantInfo.name"]').type(nameValue);
    cy.get('[data-cy="reference-input-participantInfo.age"]').type(ageValue);

    // click Save button
    cy.get('[data-cy="save-button"]').click();

    // verify values r stored in localStorage
    cy.window().then((win) => {
      const jsonData = JSON.parse(win.localStorage.getItem('jsonData') || '{}');
      expect(jsonData['stage_0']['participantInfo.name']).to.equal(nameValue);
      expect(jsonData['stage_0']['participantInfo.age']).to.equal(ageValue);
    });

    // verify saved values r displayed in UI
    cy.get('[data-cy="reference-display-participantInfo.name"]').should('contain', `Saved Value: ${nameValue}`);
    cy.get('[data-cy="reference-display-participantInfo.age"]').should('contain', `Saved Value: ${ageValue}`);
  });

  it('displays "No references found" message when no references exist', () => {
    // clear YAML treatment
    let emptyYamlTreatment = `
          name: reference_test
          playerCount: 1
          gameStages: []
      `;
    cy.get('[data-cy="code-editor"]').clear().type(emptyYamlTreatment);
    cy.get('[data-cy="yaml-save"]').click();

    // check
    cy.get('[data-cy="no-references-message"]').should('contain', 'No references found');
  });
});
