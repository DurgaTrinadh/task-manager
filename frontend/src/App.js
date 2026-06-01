import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'linear-gradient(135deg, #667eea, #764ba2)',
      fontFamily: 'Inter, sans-serif', flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{
        width: 48, height: 48, border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <p style={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}>Loading TaskFlow...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return user ? <Dashboard /> : <AuthPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}