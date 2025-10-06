import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { resetUserBalance } from '../services/api';

const Navbar = ({ balance, onBalanceUpdate }) => {
  const location = useLocation();
  const [isResetting, setIsResetting] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleResetBalance = async () => {
    if (window.confirm('Are you sure you want to reset your balance to $10,000? This will clear all your current progress.')) {
      setIsResetting(true);
      try {
        const response = await resetUserBalance();
        if (response.success) {
          onBalanceUpdate(response.balance);
          alert('Balance successfully reset to $10,000!');
        } else {
          alert('Error resetting balance: ' + response.message);
        }
      } catch (error) {
        alert('Error resetting balance. Please try again.');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💰</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                YouthInvest
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/projects"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/projects')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
                }`}
              >
                Projects
              </Link>
              <Link
                to="/portfolio"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/portfolio')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
                }`}
              >
                Portfolio
              </Link>
              <Link
                to="/simulation"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/simulation')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
                }`}
              >
                Simulation
              </Link>
              <Link
                to="/learn"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/learn')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
                }`}
              >
                Learn
              </Link>
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex items-center space-x-4">
            <div className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium">
              Balance: {formatCurrency(balance)}
            </div>
            
            {/* Reset Balance Button */}
            <button
              onClick={handleResetBalance}
              disabled={isResetting}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reset balance to $10,000"
            >
              {isResetting ? '⏳' : '🔄'}
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-primary-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/projects')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/portfolio"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/portfolio')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              Portfolio
            </Link>
            <Link
              to="/simulation"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/simulation')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              Simulation
            </Link>
            <Link
              to="/learn"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/learn')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              Learn
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;