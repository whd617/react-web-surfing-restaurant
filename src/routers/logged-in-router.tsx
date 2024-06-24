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
import { RestaurantDetail } from '../pages/client/restaurant-detail';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/order';
import { Dashboard } from '../pages/driver/dashboard';
import { UserRole } from '../gql/graphql';

const clientRoutes = [
  {
    path: '/',
    component: <Restaurants />,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurant/:id',
    component: <RestaurantDetail />,
  },
];

const commonRoutes = [
  {
    path: '/confirm',
    component: <ConfirmEmail />,
  },
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
  {
    path: '/order/:id',
    component: <Order />,
  },
];

const restaurantRoutes = [
  {
    path: '/',
    component: <MyRestaurants />,
  },
  {
    path: '/add-restaurant',
    component: <AddRestaurant />,
  },
  {
    path: '/restaurant/:id',
    component: <MyRestaurant />,
  },
  { path: '/restaurant/:restaurantId/add-dish', component: <AddDish /> },
];

const driverRoutes = [
  {
    path: '/',
    component: <Dashboard />,
  },
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
        {/* client Route */}
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {/* Owner Route */}
        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {/* Driver Route */}
        {data.me.role === UserRole.Delivery &&
          restaurantRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {/* Common Route */}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
