import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { MeQuery, MeQueryVariables } from '../gql/graphql';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';

const ClientRoutes = [<Route path="/" element={<Restaurants />} />];

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
    <Router>
      <Routes>
        {data.me.role === 'Client' && ClientRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
