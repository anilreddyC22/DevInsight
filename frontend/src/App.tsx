import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Metrics from './pages/Metrics';

function ForceHomeOnReload() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Robust check for reload using Navigation API if available
    let isReload = false;
    if (window.performance && window.performance.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        const navEntry = navEntries[0] as PerformanceNavigationTiming;
        isReload = navEntry.type === 'reload';
      }
    } else if (performance && performance.navigation) {
      isReload = performance.navigation.type === 1;
    }

    if (!hasRedirected.current && isReload && location.pathname !== '/') {
      hasRedirected.current = true;
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <ForceHomeOnReload />
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/metrics" element={<Metrics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 