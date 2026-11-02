import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ScannerPage from './pages/ScannerPage';

// Lazy-load dashboard route for bundle size optimization
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function RouteLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        color: 'var(--forest-300)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span
          style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            border: '2px solid var(--forest-500)',
            borderTopColor: 'transparent',
            animation: 'spin 0.6s linear infinite'
          }}
        />
        <span>LOADING TELEMETRY MODULE...</span>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/scan" element={<ScannerPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ThemeProvider>
  );
}
