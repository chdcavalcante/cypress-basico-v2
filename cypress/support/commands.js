Cypress.Commands.add('preencherFormularioEClicaEnviar', function (nome, sobrenome, email, textoAjuda) {

    cy.get('#firstName').type(nome)
    cy.get('#lastName').type(sobrenome)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(textoAjuda)
    cy.get('button[type="submit"]').click()
})