// reactive variable과 link의 개념
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
  split,
} from '@apollo/client';
import { LOCALSTORAGE_TOKEN } from './constants';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

// reactive variable
export const isLoggedInVar = makeVar(Boolean(token));
// token 가져오기
export const authTokenVar = makeVar(token);

// Apollo Subscription을 사용하기 위한 웹소켓 통신
const wsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NODE_ENV === 'production'
        ? 'wss://web-restaurants-backend-78a7ec1afcae.herokuapp.com'
        : 'ws://localhost:4000/graphql',
    connectionParams: {
      'x-jwt': authTokenVar() || '',
    },
  }),
);

// link는 연결할 수 있는 것들을 말함(http, auth, web sockets 링크)
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://web-restaurants-backend-78a7ec1afcae.herokuapp.com'
      : 'http://localhost:4000/graphql',
});

// link는 연결할 수 있는 것들을 말함(http, auth, web sockets 링크)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    },
  };
});

// websoket과 http link 연결시 사용하기 위한 기준
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const client = new ApolloClient({
  /* authLink.concat을 활용하여 여러 Link를 사용하는 방법 */
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
