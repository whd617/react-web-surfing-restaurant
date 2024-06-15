import { CreateAccount } from '../create-account';
import { ApolloProvider } from '@apollo/client';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';
// custom render import
import { render, waitFor } from '../../test-utils';

describe('<CreateAccount />', () => {
  let mockedClient: MockApolloClient;
  mockedClient = createMockClient();

  it('renders OK', async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Create Account | NuberEats');
    });
  });
});
