import React, { useState, useEffect } from 'react';
import { getPortfolio } from '../services/api';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await getPortfolio();
      if (response.success) {
        setPortfolio(response.portfolio);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
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

  const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio || !portfolio.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Portfolio Found</h3>
          <p className="text-gray-600">Start investing to build your portfolio!</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const categoryData = Object.entries(portfolio.diversification).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: ((amount / portfolio.total_invested) * 100).toFixed(1)
  }));

  const investmentPerformanceData = portfolio.investments.map((inv, index) => ({
    name: inv.project_name.substring(0, 10) + '...',
    invested: inv.amount,
    current: inv.current_value,
    return: inv.return_amount
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Investment Portfolio</h1>
          <p className="text-xl text-gray-600">Track your investments and watch your wealth grow</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(portfolio.user.balance)}</div>
            <div className="text-sm text-gray-600">Available Balance</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-primary-600">{formatCurrency(portfolio.total_invested)}</div>
            <div className="text-sm text-gray-600">Total Invested</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-2xl font-bold text-success-600">{formatCurrency(portfolio.current_value)}</div>
            <div className="text-sm text-gray-600">Current Value</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">{portfolio.total_return >= 0 ? '📊' : '📉'}</div>
            <div className={`text-2xl font-bold ${portfolio.total_return >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {portfolio.total_return >= 0 ? '+' : ''}{portfolio.total_return_percentage.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Total Return</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Diversification */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Portfolio Diversification</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No investments to display</p>
              </div>
            )}
          </div>

          {/* Investment Performance */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Investment Performance</h3>
            {investmentPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investmentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="invested" fill="#94A3B8" name="Invested" />
                  <Bar dataKey="current" fill="#3B82F6" name="Current Value" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">📈</div>
                <p>No performance data to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Individual Investments */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6">Your Investments</h3>
          
          {portfolio.investments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Risk</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Invested</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Current Value</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.investments.map((investment) => (
                    <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{investment.project_name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(investment.investment_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{investment.category}</td>
                      <td className="py-4 px-4">
                        <span className={getRiskBadgeClass(investment.risk_level)}>
                          {investment.risk_level}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatCurrency(investment.current_value)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`font-medium ${investment.return_amount >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                          {investment.return_amount >= 0 ? '+' : ''}{formatCurrency(investment.return_amount)}
                        </div>
                        <div className={`text-sm ${investment.return_percentage >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                          {investment.return_percentage >= 0 ? '+' : ''}{investment.return_percentage.toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Investments Yet</h3>
              <p className="text-gray-600 mb-4">Start investing in local projects to build your portfolio!</p>
              <a href="/projects" className="btn-primary">
                Explore Projects 🚀
              </a>
            </div>
          )}
        </div>

        {/* Portfolio Insights */}
        {portfolio.investments.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="card text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-lg font-semibold text-gray-900">
                {portfolio.investments.length} {portfolio.investments.length === 1 ? 'Investment' : 'Investments'}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(portfolio.total_invested / portfolio.investments.length)}
              </div>
              <div className="text-sm text-gray-600">Average Investment</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-lg font-semibold text-gray-900">
                {Object.keys(portfolio.diversification).length} {Object.keys(portfolio.diversification).length === 1 ? 'Category' : 'Categories'}
              </div>
              <div className="text-sm text-gray-600">Portfolio Spread</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;