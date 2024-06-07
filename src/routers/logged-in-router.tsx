import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';

const ClientRoutes = [<Route path="/" element={<Restaurants />} />];

export const LoggedInRouter = () => {
  /* hook을 활용한 user data 사용 */
  const { data, loading, error } = useMe();
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
      <Header />
      <Routes>
        {data.me.role === 'Client' && ClientRoutes}
        <Route element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
