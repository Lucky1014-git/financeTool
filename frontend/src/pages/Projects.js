import React, { useState, useEffect } from 'react';
import { getProjects, makeInvestment } from '../services/api';

const Projects = ({ balance, onBalanceUpdate }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investmentModal, setInvestmentModal] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await getProjects();
      if (response.success) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestment = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    if (parseFloat(investmentAmount) > balance) {
      alert('Insufficient balance for this investment');
      return;
    }

    setInvesting(true);
    try {
      const response = await makeInvestment(investmentModal.id, parseFloat(investmentAmount));
      if (response.success) {
        alert('Investment successful!');
        onBalanceUpdate(balance - parseFloat(investmentAmount));
        setInvestmentModal(null);
        setInvestmentAmount('');
        loadProjects(); // Refresh projects to show updated funding
      } else {
        alert(response.message || 'Investment failed');
      }
    } catch (error) {
      console.error('Investment error:', error);
      alert('Failed to process investment');
    } finally {
      setInvesting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return 'risk-medium';
    }
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      if (filter === 'all') return true;
      return project.risk_level.toLowerCase() === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'roi': return b.expected_roi - a.expected_roi;
        case 'funding': return a.funding_goal - b.funding_goal;
        case 'risk': 
          const riskOrder = { 'low': 1, 'medium': 2, 'high': 3 };
          return riskOrder[a.risk_level.toLowerCase()] - riskOrder[b.risk_level.toLowerCase()];
        default: return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Projects</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover local businesses and startups ready for your investment. Support your community while learning about returns and risks.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 flex items-center">Filter by risk:</span>
              {['all', 'low', 'medium', 'high'].map(risk => (
                <button
                  key={risk}
                  onClick={() => setFilter(risk)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filter === risk
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Name</option>
                <option value="roi">Expected ROI</option>
                <option value="funding">Funding Goal</option>
                <option value="risk">Risk Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.map((project) => (
            <div key={project.id} className="card card-hover">
              {/* Project Image */}
              <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={project.image_url}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                  }}
                />
              </div>

              {/* Project Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                  <span className={getRiskBadgeClass(project.risk_level)}>
                    {project.risk_level}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">{project.description}</p>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>📍 {project.location}</span>
                  <span>🏷️ {project.category}</span>
                </div>

                {/* Funding Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-medium">{project.funding_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min(project.funding_percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatCurrency(project.current_funding)} raised</span>
                    <span>{formatCurrency(project.funding_goal)} goal</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-600">{project.expected_roi}%</div>
                    <div className="text-xs text-gray-500">Expected ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{project.days_remaining}</div>
                    <div className="text-xs text-gray-500">Days Left</div>
                  </div>
                </div>

                {/* Invest Button */}
                <button
                  onClick={() => setInvestmentModal(project)}
                  className="w-full btn-primary"
                >
                  Invest Now 💰
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more projects.</p>
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {investmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Invest in {investmentModal.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Expected ROI:</span>
                  <span className="font-medium text-success-600">{investmentModal.expected_roi}%</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Risk Level:</span>
                  <span className={getRiskBadgeClass(investmentModal.risk_level)}>
                    {investmentModal.risk_level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Balance:</span>
                  <span className="font-medium">{formatCurrency(balance)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="1"
                  max={balance}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setInvestmentModal(null)}
                className="flex-1 btn-secondary"
                disabled={investing}
              >
                Cancel
              </button>
              <button
                onClick={handleInvestment}
                className="flex-1 btn-success"
                disabled={investing}
              >
                {investing ? 'Investing...' : 'Invest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;