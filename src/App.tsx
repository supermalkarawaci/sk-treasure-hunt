import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Toast from './components/UI/Toast';

// Pages
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import QRScanner from './pages/QRScanner';
import PhotoCapture from './pages/PhotoCapture';
import Map from './pages/Map';

// PWA Registration
const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};

function App() {
  useEffect(() => {
    registerSW();
  }, []);

  return (
    <GameProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner/:locationId" element={<QRScanner />} />
            <Route path="/photo/:locationId" element={<PhotoCapture />} />
            <Route path="/map" element={<Map />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;