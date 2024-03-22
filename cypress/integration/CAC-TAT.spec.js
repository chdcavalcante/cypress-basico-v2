/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function () {

    const TRES_SEGUNDOS_EM_MILISSEGUNDOS = 3000

    beforeEach(() => {
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })
    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longtext = Cypress._.repeat('text, ', 20)

        cy.clock()

        cy.get('#firstName').type('Carlos')
        cy.get('#lastName').type('Cavalcante')
        cy.get('#email').type('carlosteste@gmail.com')
        cy.get('#open-text-area').type(longtext, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(TRES_SEGUNDOS_EM_MILISSEGUNDOS)
        cy.get('.success').should('not.be.visible')

    })
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.clock()

        cy.get('#firstName').type('Carlos')
        cy.get('#lastName').type('Cavalcante')
        cy.get('#email').type('emailerrogmail.com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(TRES_SEGUNDOS_EM_MILISSEGUNDOS)
        cy.get('.error').should('not.be.visible')
    })
    it('Campo telefone não aceita letras', function () {

        cy.get('#phone').type('teste').should('have.text', '')
    })
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.clock()

        cy.get('#firstName').type('Carlos')
        cy.get('#lastName').type('Cavalcante')
        cy.get('#email').type('carlosteste@gmail.com')
        cy.get('#open-text-area').type('teste')
        cy.get('#phone-checkbox').check()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(TRES_SEGUNDOS_EM_MILISSEGUNDOS)
        cy.get('.error').should('not.be.visible')
    })
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName').type('Carlos').should('have.value', 'Carlos').clear().should('have.value', '')
        cy.get('#lastName').type('Cavalcante').should('have.value', 'Cavalcante').clear().should('have.value', '')
        cy.get('#email').type('carlosteste@gmail.com').should('have.value', 'carlosteste@gmail.com').clear().should('have.value', '')
        cy.get('#phone').type('08288988024').should('have.value', '08288988024').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.clock()

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(TRES_SEGUNDOS_EM_MILISSEGUNDOS)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.clock()

        cy.preencherFormularioEClicaEnviar('Carlos', 'Henrique', 'carlos@teste.com', 'teste 01')

        cy.get('.success').should('be.visible')

        cy.tick(TRES_SEGUNDOS_EM_MILISSEGUNDOS)
        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product').should('be.visible').select('YouTube').should('have.value', 'youtube')
    })
    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product').should('be.visible').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product').should('be.visible').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]').check().should('be.checked')
    })

    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]')
            .should('have.length', 2)
            .check()
            .last()
            .uncheck()
    })

    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })

    })
    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })

    })
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json', { encoding: null }).as('exampleFile')
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('@exampleFile', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    Cypress._.times(5, () => {
        it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
            cy.get('#privacy a').invoke('removeAttr', 'target')
                .click()
            cy.contains('Talking About Testing').should('be.visible')
        })

    })
    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', function(){
        const longtext = Cypress._.repeat('text, ', 200)

        cy.get('#open-text-area')
            .invoke('val', longtext)
            .should('have.value', longtext)
    })

    it('faz uma requisição HTTP', function(){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .should(function(response){
            const{status, statusText, body} = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
        })
    })
    it.only('desafio gato escondido', function(){
        cy.get('#cat').invoke('show').should('be.visible')
    })

})
