// npm run cypress:open

describe('code editor', () => {
    beforeEach(() => {
        // initial yaml treatment
        let yamltreatment = "name: cypress_code_editor_test\nplayerCount: 1\ngameStages:\n- name: Stage 1\n  duration: 100\nelements:\n  - name: Element 1\n  type: survey\nsurveyName: CRT"

        cy.viewport(2000, 1000, { log: false });

        cy.visit('http://localhost:3000/editor')
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').should('exist')
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type('{ctrl+a}{del}', { release: false }) // equivalent to clear() in cypress
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type(`${yamltreatment}{pageUp}`)

        // verify initial text in editor

        // text values from monaco-editor will include line numbers and no line breaks
        // the yamltreatment variable has no line numbers and line breaks
        // so right now comparison is only on the treatmentName
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains('cypress_code_editor_test')
        cy.get('[data-cy="yaml-save"]').click()

        // verify value in stage cards
        cy.get('[data-cy="stage-0"]').contains("Stage 1").should("be.visible")
        cy.get('[data-cy="element-0-0"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-0"]').contains("Element 1").should("be.visible")
    });

    it('reflects code editor changes in stage cards', () => {
        // add new element using code editor
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{moveToEnd}{enter}", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{backspace}{backspace}  - name: Element 2\n  type: prompt\nfile: projects/example/preDiscussionInstructions.md")
        cy.get('[data-cy="yaml-save"]').click()


        // verify changes in code editor
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("- name: Element 2").should("be.visible")

        // verify changes in stage cards
        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="element-0-1"]').contains("prompt").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible")
    })

    it('reflects stage card changes in editor', () => {
        // add new element using stage cards
        cy.get('[data-cy="add-element-button-0"]').click()
        cy.get('[data-cy="edit-element-name-0-new"]').type("Element 2")
        cy.get('[data-cy="edit-element-type-0-new"]').select("Survey")
        cy.get('[data-cy="edit-element-surveyName-0-new"]').select("TIPI")
        cy.get('[data-cy="edit-element-save-0-new"]').click()

        // verify changes in stage cards
        cy.get('[data-cy="element-0-1"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("TIPI").should("be.visible")

        // verify changes in code editor
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("- name: Element 2").should("be.visible")
    })


    it('does not save when yaml is improperly formatted', () => {
        // edit to poorly formatted yaml using code editor
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{moveToEnd}{enter}", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{home}  name: Element 2\n  type: survey\nsurveyName: CRT")
        cy.get('[data-cy="yaml-save"]').click()

        // verify text is updated in editor but no change in stage cards
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("name: Element 2").should("be.visible")
        cy.get('[data-cy="element-0-1"]').should('not.exist')
        cy.get('[data-cy="element-0-0"]').should('exist')

        // correct mistake and save
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{end}{upArrow}{upArrow}{home}      - ", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{end}{upArrow}{home}      ", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{end}{home}      ", { release: false })
        cy.get('[data-cy="yaml-save"]').click()

        // verify text is updated in editor and in stage cards
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("- name: Element 2").should("be.visible")
        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="element-0-1"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible")


    })

    it('does not save when treatment (stage) is improperly formatted', () => {
        // add poorly formatted stage using code editor
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{moveToEnd}{enter}", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{home}  - name: Stage 2\n  duration: 300\nelements: []")
        cy.get('[data-cy="yaml-save"]').click()

        // verify text is updated in editor but no change in stage cards
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("- name: Stage 2").should("be.visible")
        cy.get('[data-cy="stage-1"]').should('not.exist')

        // correct mistake and save
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("\n- name: Element 2\n  type: survey\nsurveyName: CRT", { release: false })
        cy.get('[data-cy="yaml-save"]').click()

        // verify text is updated in editor and in stage cards
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("- name: Stage 2").should("be.visible")
        cy.get('[data-cy="stage-1"]').should('exist')
        cy.get('[data-cy="element-1-0"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-1-0"]').contains("Element 2").should("be.visible")
    })

    it('does not save when treatment (element) is improperly formatted', () => {
        // add poorly formatted element using code editor
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{moveToEnd}{enter}", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{backspace}{backspace}  - name: Element 2")
        cy.get('[data-cy="yaml-save"]').click()

        // verify text is updated in editor but no change in stage cards
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("- name: Element 2").should("be.visible")
        cy.get('[data-cy="element-0-1"]').should('not.exist')

        // correct mistake and save
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("{end}", { release: false })
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').type("\n  type: survey\nsurveyName: CRT", { release: false })
        cy.get('[data-cy="yaml-save"]').click()

        // verify text is updated in editor and in stage cards
        cy.get('[data-cy="code-editor"]').get('.monaco-editor').contains("- name: Element 2").should("be.visible")
        cy.get('[data-cy="stage-0"]').should('exist')
        cy.get('[data-cy="element-0-1"]').contains("survey").should("be.visible")
        cy.get('[data-cy="element-0-1"]').contains("Element 2").should("be.visible")
    })


})