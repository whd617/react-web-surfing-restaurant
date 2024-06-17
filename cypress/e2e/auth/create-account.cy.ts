import { should } from 'chai';

describe('Create Account', () => {
  const user = cy;
  it('should see email / password validation errors and login', () => {
    user.visit('/');
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type('non@good');
    user.get('body').click();
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.get('body').click();
    user.findByRole('alert').should('have.text', 'Email is required');
    user.findByPlaceholderText(/email/i).type('real@mail.com');
    user
      .findByPlaceholderText(/password/i)
      .type('a')
      .clear();
    user.get('body').click();
    user.findByRole('alert').should('have.text', 'Password is required');
  });
  it('should be able to create account', () => {
    /* localhost의 graphql를 intercept */
    user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === 'createAccount') {
        req.reply((res) => {
          /*res.send()를 통한 fixture보내기*/
          res.send({
            fixture: 'auth/create-account.json',
          });
        });
      }
    });
    user.visit('/create-account');
    user.findByPlaceholderText(/email/i).type('client@client.com');
    user.findByPlaceholderText(/password/i).type('123');
    user.findByRole('button').click();
    user.wait(1000);
    user.login('client@client.com', '123');
  });
});
