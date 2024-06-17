import React from 'react';
import { render, waitFor } from '../../../test-utils';
import { CATEGORY_QUERY, Category } from '../category';
import { ApolloProvider } from '@apollo/client';

import { MockApolloClient, createMockClient } from 'mock-apollo-client';
import { MockedProvider } from '@apollo/client/testing';

describe('<Category />', () => {
  let mockedClient: MockApolloClient;
  mockedClient = createMockClient();
  it('render OK', async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: CATEGORY_QUERY,
              variables: {
                input: {
                  page: 1,
                  slug: 'test-slug',
                },
              },
            },
            result: {
              data: {
                category: {
                  ok: true,
                  error: null,
                  totalPages: 1,
                  totalResults: 1,
                  restaurants: [
                    {
                      __typename: 'Restaurant',
                      id: '1',
                      name: 'Test Restaurant',
                      coverImg: 'test-img.jpg',
                      category: {
                        __typename: 'Category',
                        name: 'Test Category',
                      },
                      address: 'xxx',
                      isPromoted: false,
                    },
                  ],
                  category: {
                    __typename: 'Category',
                    id: '1',
                    name: 'Test Category',
                    coverImg: 'test-img.jpg',
                    slug: 'test-slug',
                  },
                },
              },
            },
          },
        ]}
      >
        <ApolloProvider client={mockedClient}>
          <Category />
        </ApolloProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Category | Nuber Eats');
    });
  });
});
