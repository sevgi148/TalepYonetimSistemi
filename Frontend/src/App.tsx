import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { KayitOl } from './pages/KayitOl';
import { Dashboard } from './pages/Dashboard';
import { TalepListesi } from './pages/TalepListesi';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/kayit-ol" element={<KayitOl />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/talepler" element={<TalepListesi />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;