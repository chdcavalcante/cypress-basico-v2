Cypress.Commands.add('preencherFormularioEClicaEnviar', function (nome, sobrenome, email, textoAjuda, telefone) {

    cy.get('#firstName').type(nome)
    cy.get('#lastName').type(sobrenome)
    cy.get('#email').type(email)
    cy.get('#phone').type(telefone)
    cy.get('#open-text-area').type(textoAjuda)  
    cy.get('button[type="submit"]').click()
})
Cypress.Commands.add('validarTitulo', function (titulo) {
    cy.title().should('be.equal', titulo)

})
Cypress.Commands.add('clicarEnviar', function(){
    cy.contains('button', 'Enviar').click()

})
Cypress.Commands.add('selecionaProduto', function(produto){
    cy.get('#product').should('be.visible').select(produto)
})


