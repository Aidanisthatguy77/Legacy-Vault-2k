import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import VaultAI from './components/VaultAI';

function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <div className="min-h-screen bg-vault-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <VaultAI />
        </div>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;