
describe('editor layout persistence', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('ResizeObserver loop')) {
        return false;
      }
    });
    cy.viewport(2000, 1000, { log: false });
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/editor');

    // initial yaml code for treatment
    const yamltreatment = `treatments: {enter}- name: cypress_code_editor_test \n  playerCount: 1 \ngameStages: {enter}{home}        - name: Stage 1 \n  duration: 100 \nelements: []`
    cy.clearCodeEditor();
    cy.appendCodeEditor(`${yamltreatment}`) // equivalent to clear() in cypress
    cy.get('[data-cy="yaml-save"]').realClick();
  });

  it('remembers the left column width after a reload', () => {
    let oldWidth: number;

    // capture initial width
    cy.get('#leftColumn')
      .should('be.visible')
      .then(($el) => {
        oldWidth = $el[0].getBoundingClientRect().width;
        cy.log('Initial width: ' + oldWidth);
      });

    // drag the splitter
    cy.get('[data-cy="splitter-vertical"]')
      .as('splitter')
      .realMouseDown({ position: 'center' })
      .wait(100)
      .realMouseMove(200, 0)
      .wait(100)
      .realMouseUp();

    // Verify the left column width changed
    cy.get('#leftColumn')
      .should('be.visible')
      .then(($el) => {
        const newWidth = $el[0].getBoundingClientRect().width;
        cy.log('New width: ' + newWidth);
        expect(newWidth).to.be.gt(oldWidth);
      });

    cy.reload();

    // After reload, check that the left column width is still > oldWidth
    cy.get('#leftColumn')
      .should('be.visible')
      .then(($el) => {
        const reloadedWidth = $el[0].getBoundingClientRect().width;
        cy.log('Width after reload: ' + reloadedWidth);
        expect(reloadedWidth).to.be.gt(oldWidth);
      });
  });

  it('remembers the upper-left panel height after a reload', () => {
    let oldHeight: number;

    cy.get('#upperLeft')
      .should('be.visible')
      .then(($el) => {
        oldHeight = $el[0].getBoundingClientRect().height;
        cy.log('Initial width: ' + oldHeight);
      });

    cy.get('[data-cy="splitter-horizontal"]')
      .should('be.visible')
      .realMouseDown({ position: 'center' })
      .realMouseMove(0, 100)
      .realMouseUp();

    // Verify the new height is different
    cy.get('#upperLeft')
      .should('be.visible')
      .then(($el) => {
        const newHeight = $el[0].getBoundingClientRect().height;
        cy.log('New height: ' + newHeight);
        expect(newHeight).to.be.gt(oldHeight);
      });

    cy.reload();

    // After reload, check the panel has the updated height
    cy.get('#upperLeft')
      .should('be.visible')
      .then(($el) => {
        const newHeight = $el[0].getBoundingClientRect().height;
        expect(newHeight).to.be.gt(oldHeight);
      });
  });

  it('remembers slider position and scale after a page reload', () => {

    cy.get('#scaleSlider')
      .should('be.visible')
      .invoke('val')
      .should('equal', '0');

    let oldWidth: number;
    cy.get('[data-cy="stage-card-0"]')
      .should('be.visible')
      .then(($el) => {
        oldWidth = $el[0].getBoundingClientRect().width;
        cy.log('Initial stage width: ' + oldWidth);
      });

    cy.get('#scaleSlider')
      .should('be.visible')
      .invoke("val", 75)
      .trigger("input");

    cy.get('#scaleSlider')
      .should('be.visible')
      .invoke('val')
      .should('equal', '75');

    let newWidth: number;
    cy.get('[data-cy="stage-card-0"]')
      .should('be.visible')
      .then(($el) => {
        newWidth = $el[0].getBoundingClientRect().width;
        cy.log('After dragging, new width: ' + newWidth);
        expect(newWidth).to.be.greaterThan(oldWidth);
      });


    cy.reload();

    // After reload, check the slider position
    cy.get('#scaleSlider')
      .should('be.visible')
      .invoke('val')
      .should('equal', '75');

    // Check that the stage block is still the new size
    cy.get('[data-cy="stage-card-0"]')
      .should('be.visible')
      .then(($el) => {
        const reloadedWidth = $el[0].getBoundingClientRect().width;
        cy.log('Reloaded stage width: ' + reloadedWidth);
        expect(reloadedWidth).to.be.closeTo(newWidth, 2);

      });
  });
});
