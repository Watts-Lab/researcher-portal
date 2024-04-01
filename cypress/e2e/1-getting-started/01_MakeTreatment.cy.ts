describe("Make a new treatment in the code editor.", () => {
    it("everything is on the page", () => {
        cy.visit('localhost:3000/editor')
        cy.contains("Render Panel")
        cy.get("textarea").type("name: cypress3_load_test")
    })
})