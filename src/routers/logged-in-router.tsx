import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';

/* Route를 다수 지정할 때 key값 기입 */
const ClientRoutes = [
  <Route key={1} path="/" element={<Restaurants />} />,
  /* confirm page 생성 */
  <Route key={2} path="/confirm" element={<ConfirmEmail />} />,
  <Route key={3} path="/edit-profile" element={<EditProfile />} />,
  <Route key={4} path="/search" element={<Search />} />,
  /* category의 slug data를 전달하는 방법 */
  <Route key={5} path="/category/:slug" element={<Category />} />,
];

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
