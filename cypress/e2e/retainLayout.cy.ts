
describe('editor layout persistence', () => {
    beforeEach(() => {
      cy.viewport(2000, 1000, { log: false });
      cy.clearLocalStorage();
      cy.visit('http://localhost:3000/editor');
      cy.wait(500);
      cy.get('[data-cy="yaml-save"]').realClick()
      cy.wait(500);
    });
  
    it('remembers the left column width after a reload', () => {
      let oldWidth: number;
      cy.get('#leftColumn')
        .then(($el) => {
            oldWidth = $el[0].getBoundingClientRect().width;
            cy.log('Initial width: ' + oldWidth);
        });
  
      cy.get('[data-cy="splitter-vertical"]')
        .realMouseDown({ position: 'center' })
        .realMouseMove(200, 0)                 
        .realMouseUp();
  
      // Verify the left column width changed
      cy.get('#leftColumn')
        .then(($el) => {
            const newWidth = $el[0].getBoundingClientRect().width;
            cy.log('New width: ' + newWidth);
            expect(newWidth).to.be.gt(oldWidth);
        });

      cy.reload();
      cy.wait(500);
  
      // After reload, check that the left column width is still > oldWidth
      cy.get('#leftColumn')
        .then(($el) => {
            const newWidth = $el[0].getBoundingClientRect().width;
            expect(newWidth).to.be.gt(oldWidth);
        });
    });
  
    it('remembers the upper-left panel height after a reload', () => {
      let oldHeight : number;

      cy.get('#upperLeft')
        .then(($el) => {
            oldHeight = $el[0].getBoundingClientRect().height;
            cy.log('Initial width: ' + oldHeight);
        });
  
      cy.get('[data-cy="splitter-horizontal"]')
        .realMouseDown({ position: 'center' })
        .realMouseMove(0, 100)                 
        .realMouseUp();
  
      // Verify the new height is different
      cy.get('#upperLeft')
        .then(($el) => {
            const newHeight = $el[0].getBoundingClientRect().height;
            cy.log('New height: ' + newHeight);
            expect(newHeight).to.be.gt(oldHeight);
        });
  
      cy.reload();
      cy.wait(500);
  
      // After reload, check the panel has the updated height
      cy.get('#upperLeft')
        .then(($el) => {
            const newHeight = $el[0].getBoundingClientRect().height;
            expect(newHeight).to.be.gt(oldHeight);
        });
    });
  });
  