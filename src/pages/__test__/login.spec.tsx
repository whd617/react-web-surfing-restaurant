import React from 'react';
import { LOGIN_MUTATION, Login } from '../login';
import { ApolloProvider } from '@apollo/client';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../test-utils';

describe('<Login />', () => {
  /* mutation test하기: MockApolloClient */
  let mockedClient: MockApolloClient;

  it('should render OK', async () => {
    mockedClient = createMockClient();
    render(
      <ApolloProvider client={mockedClient}>
        <Login />
      </ApolloProvider>,
    );
    await waitFor(() => {
      expect(document.title).toBe('Login | NuberEats');
    });
  });

  it('displays email validation errors', async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <Login />
      </ApolloProvider>,
    );
    /* /email/i : regular expression */
    const email = screen.getByPlaceholderText(/email/i);
    await waitFor(async () => {
      await userEvent.type(email, 'this@wont');
    });
    let errorMessage = screen.getByRole('alert');
    /* /please enter a valid email/i : regular expression */
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    await waitFor(async () => {
      await userEvent.clear(email);
    });
    errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it('display password required errors', async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <Login />
      </ApolloProvider>,
    );
    /* /email/i : regular expression */
    const email = screen.getByPlaceholderText(/email/i);
    const submitBtn = screen.getByRole('button', { name: /submit-button/i });
    userEvent.type(email, 'this@wont.com');
    userEvent.click(submitBtn);
    await waitFor(async () => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/password is required/i);
    });
  });

  it('submit form and calls mutation', async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <Login />
      </ApolloProvider>,
    );
    /* /email/i : regular expression */
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /submit-button/i });
    const formData = {
      email: 'real@test.com',
      password: '123',
    };

    /* mutation의 return 값을 test하는 mockResolvedValue */
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: 'xxx',
          error: 'mutation-error',
        },
      },
    });

    /* mutation test를 위한 setRequestHandler */
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    /* localStorage test하기 */
    jest.spyOn(Storage.prototype, 'setItem');

    await waitFor(async () => {
      await userEvent.type(email, formData.email);
      await userEvent.type(password, formData.password);
      await userEvent.click(submitBtn);
    });

    // mutation의 return값을 mock했으므로 할 수 있는 test
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    await waitFor(async () => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/mutation-error/i);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('nuber-token', 'xxx');
  });
});
