import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TranslatorPage from './pages/TranslatorPage';
import GestureLibraryPage from './pages/GestureLibraryPage';
import EvaluationPage from './pages/EvaluationPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [backendStatus, setBackendStatus] = useState('connecting');

  // Periodic health check against FastAPI backend
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/health', { method: 'GET' });
        if (res.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch {
        setBackendStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Header Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        backendStatus={backendStatus} 
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage} 
            backendStatus={backendStatus} 
          />
        )}

        {activePage === 'translator' && (
          <TranslatorPage 
            backendStatus={backendStatus} 
            setBackendStatus={setBackendStatus} 
          />
        )}

        {activePage === 'library' && (
          <GestureLibraryPage 
            setActivePage={setActivePage} 
          />
        )}

        {activePage === 'evaluation' && (
          <EvaluationPage />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
