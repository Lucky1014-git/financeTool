import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Portfolio from './pages/Portfolio';
import Simulation from './pages/Simulation';
import FinancialLiteracy from './pages/FinancialLiteracy';
import { getUserBalance } from './services/api';

function App() {
  const [userBalance, setUserBalance] = useState(10000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await getUserBalance();
      if (response.success) {
        setUserBalance(response.balance);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = (newBalance) => {
    setUserBalance(newBalance);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your investing platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar balance={userBalance} onBalanceUpdate={updateBalance} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/projects" 
              element={<Projects balance={userBalance} onBalanceUpdate={updateBalance} />} 
            />
            <Route 
              path="/portfolio" 
              element={<Portfolio />} 
            />
            <Route 
              path="/simulation" 
              element={<Simulation />} 
            />
            <Route 
              path="/learn" 
              element={<FinancialLiteracy />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;