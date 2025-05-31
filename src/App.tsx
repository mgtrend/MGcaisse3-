/**
 * Composant principal de l'application MGcaisse3.0
 * Gère le routage et la structure globale de l'application
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { databaseService } from './services/DatabaseService';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  // Initialiser la base de données au chargement de l'application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await databaseService.initialize();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
