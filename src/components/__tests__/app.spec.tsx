import React from 'react';
import { App } from '../app';
import { isLoggedInVar } from '../../apollo';
import { render, screen, waitFor } from '@testing-library/react';

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
  it('renders LoggedOutRouter', async () => {
    const { getByText } = await render(<App />);
    screen.getByText('logged-out');
  });
  it('renders LoggedInRouter', async () => {
    const { getByText } = await render(<App />);

    /* waitFor: state를 바꿔주고 있고 state가 refresh하고 해당 ReactiveVariable을 함수를 사용할 수 있도록 기다려준다. */
    await waitFor(() => {
      isLoggedInVar(true);
    });
    screen.getByText('logged-in');
  });
});
