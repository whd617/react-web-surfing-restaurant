import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/login';
import { CreateAccount } from '../pages/create-account';

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
};
