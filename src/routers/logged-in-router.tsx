import React from 'react';
import { isLoggedInVar } from '../apollo';
import { gql, useQuery } from '@apollo/client';
import { MeQuery, MeQueryVariables } from '../gql/graphql';

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

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery, MeQueryVariables>(
    ME_QUERY,
  );
  /* 데이터가 없거나 로딩중이거나 에러가 있으면 if문 진행 */
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <h1>{data.me.email}</h1>
    </div>
  );
};
