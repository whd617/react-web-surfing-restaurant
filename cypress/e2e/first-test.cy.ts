describe('Log In', () => {
  it('should see login page', () => {
    cy.visit('/').title().should('eq', 'Login | NuberEats');
  });

  it('can fill out the form', () => {
    cy.visit('/');
    cy.findByPlaceholderText(/email/i).type('user@test.com');
    cy.findByPlaceholderText(/password/i).type('123');
    cy.findByRole('button').should('not.have.class', 'pointer-events-none');
    // to do (can log in)
  });
  it('can see email / password validation errors', () => {
    cy.visit('/');
    cy.findByPlaceholderText(/email/i).type('bad@email');
    cy.findByRole('alert').should('have.text', 'Please enter a valid email');
  });
});
