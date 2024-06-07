import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/login';
import { CreateAccount } from '../pages/create-account';
import { NotFound } from '../pages/404';

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
