import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../gql/graphql';

/* User data cache에 바로 바로 접근할 수 있는 hook */
const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};
