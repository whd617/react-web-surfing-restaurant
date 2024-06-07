// reactive variable과 link의 개념
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
} from '@apollo/client';
import { LOCALSTORAGE_TOKEN } from './constants';
import { setContext } from '@apollo/client/link/context';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

// reactive variable
export const isLoggedInVar = makeVar(Boolean(token));
// token 가져오기
export const authTokenVar = makeVar(token);

// link는 연결할 수 있는 것들을 말함(http, auth, web sockets 링크)
const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' });

// link는 연결할 수 있는 것들을 말함(http, auth, web sockets 링크)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    },
  };
});

export const client = new ApolloClient({
  /* authLink.concat을 활용하여 여러 Link를 사용하는 방법 */
  link: authLink.concat(httpLink),
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
