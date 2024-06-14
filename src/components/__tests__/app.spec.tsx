import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { App } from '../app';
import { isLoggedInVar } from '../../apollo';

jest.mock('../../routers/logged-out-router', () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock('../../routers/logged-in-router', () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe('<App />', () => {
  it('renders LoggedOutRouter', () => {
    const { getByText } = render(<App />);
    getByText('logged-out');
  });
  it('renders LoggedInRouter', async () => {
    const { getByText, debug } = render(<App />);
    /* waitFor: state를 바꿔주고 있고 state가 refresh하고 해당 ReactiveVariable을 함수를 사용할 수 있도록 기다려준다. */
    await waitFor(() => {
      isLoggedInVar(true);
    });
    debug();
    getByText('logged-in');
  });
});
