describe('ReferenceData Component', () => {
  const stageIndex = 0;

  beforeEach(() => {
    // Clear localStorage 
    cy.clearLocalStorage();

    // Set initial localStorage data using Cypress window object
    const initialData = {
      [`stage_${stageIndex}`]: { reference1: 'Test Value 1' },
    };

    cy.visit('http://localhost:3000/editor');


    cy.window().then((win) => {
      win.localStorage.setItem('jsonData', JSON.stringify(initialData));
      console.log('Initial LocalStorage jsonData:', win.localStorage.getItem('jsonData'));
    });

    cy.wait(500);
    cy.reload();
  });

  it('confirms localStorage is set correctly', () => {
    // Verify that localStorage contains the expected data
    cy.window().then((win) => {
      const jsonData = JSON.parse(win.localStorage.getItem('jsonData') || '{}');
      expect(jsonData[`stage_${stageIndex}`].reference1).to.equal('Test Value 1');
    });
  });

  it('keeps values isolated by stage', () => {
    const stage2Data = { reference2: 'Stage 2 Value' };

    cy.window().then((win) => {
      win.localStorage.setItem('jsonData', JSON.stringify({ stage_1: stage2Data }));
    });

    cy.wait(500);
    cy.reload();

    // Verify that the stage 2 value is set correctly in localStorage
    cy.window().then((win) => {
      const jsonData = JSON.parse(win.localStorage.getItem('jsonData') || '{}');
      expect(jsonData['stage_1'].reference2).to.equal('Stage 2 Value');
    });
  });
});
