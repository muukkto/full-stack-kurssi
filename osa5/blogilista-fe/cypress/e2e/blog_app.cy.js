describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Maija Meikalainen',
      username: 'mmeika',
      password: 'salasana'
    }
    const user2 = {
      name: 'Medel Svensson',
      username: 'msvens',
      password: 'losenord'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Maija Meikalainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('makela')
      cy.get('#password').type('salasana4')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()

      cy.get('#title').type('React patterns')
      cy.get('#author').type('Michael Chan')
      cy.get('#url').type('https://reactpatterns.com/')
      
      cy.contains('save').click()

      cy.contains('React patterns Michael Chan')
    })

    describe('A blog has been created', function() {
      beforeEach(function() {
        cy.contains('new blog').click()

        cy.get('#title').type('React patterns')
        cy.get('#author').type('Michael Chan')
        cy.get('#url').type('https://reactpatterns.com/')
      
        cy.contains('save').click()
      })
  
      it('A blog can be liked', function() {
        cy.contains('show').click()
        cy.contains('likes 0')

        cy.contains('Like').click()
        cy.contains('likes 1')
      })

      it('A blog can be removed', function() {
        cy.reload()

        cy.contains('show').click()
        cy.contains('remove').click()
        cy.contains('React patterns Michael Chan').should('not.exist')
      })

      it('Blogs are ordered', function() {
        cy.reload()

        cy.contains('new blog').click()

        cy.get('#title').type('React patterns vol. 2')
        cy.get('#author').type('Michael Chan')
        cy.get('#url').type('https://reactpatterns.com/')
      
        cy.contains('save').click()

        cy.get('.blog').eq(1).contains('show').click()
        cy.get('.blog').eq(1).contains('Like').click()

        cy.reload()

        cy.get('.blog').eq(1).should('contain', 'React patterns vol. 2')
        cy.get('.blog').eq(0).should('contain', 'React patterns')
      })
    })
  })

  describe('Users rights', function() {
    beforeEach(function() {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('new blog').click()

      cy.get('#title').type('React patterns')
      cy.get('#author').type('Michael Chan')
      cy.get('#url').type('https://reactpatterns.com/')
      
      cy.contains('save').click()

      cy.contains('logout').click()
    })

    it('Users cannot remove each others blogs', function() {
      cy.reload()

      cy.get('#username').type('msvens')
      cy.get('#password').type('losenord')
      cy.get('#login-button').click()

      cy.contains('show').click()
      cy.contains('remove').should('not.exist')
    }) 
  })
})