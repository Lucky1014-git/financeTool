import React, { useState, useEffect } from 'react';
import { getSimulationData } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Simulation = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('growth');

  useEffect(() => {
    loadSimulationData();
  }, []);

  const loadSimulationData = async () => {
    try {
      const response = await getSimulationData();
      if (response.success) {
        setSimulationData(response.simulation_data);
      }
    } catch (error) {
      console.error('Error loading simulation data:', error);
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

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const COLORS = ['#22C55E', '#F59E0B', '#EF4444'];

  const tabs = [
    { id: 'growth', label: 'Portfolio Growth', icon: '📈' },
    { id: 'risk', label: 'Risk Analysis', icon: '⚡' },
    { id: 'market', label: 'Market Trends', icon: '📊' },
    { id: 'impact', label: 'Economic Impact', icon: '🌍' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation data...</p>
        </div>
      </div>
    );
  }

  if (!simulationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Simulation Data</h3>
          <p className="text-gray-600">Unable to load simulation data at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Simulation</h1>
          <p className="text-xl text-gray-600">
            Explore market trends, analyze risks, and understand the economic impact of your investments
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 mx-1 mb-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portfolio Growth Tab */}
        {activeTab === 'growth' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-2xl font-semibold mb-6">Portfolio Growth Simulation</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={simulationData.portfolio_growth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="invested" stackId="1" stroke="#94A3B8" fill="#94A3B8" name="Invested" />
                  <Area type="monotone" dataKey="value" stackId="2" stroke="#3B82F6" fill="#3B82F6" name="Portfolio Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Insights */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-success-600">
                  {((simulationData.portfolio_growth[simulationData.portfolio_growth.length - 1].value / simulationData.portfolio_growth[0].value - 1) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Total Growth</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(simulationData.portfolio_growth[simulationData.portfolio_growth.length - 1].value)}
                </div>
                <div className="text-sm text-gray-600">Final Value</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-gray-900">
                  {simulationData.portfolio_growth.length} Months
                </div>
                <div className="text-sm text-gray-600">Investment Period</div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === 'risk' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-2xl font-semibold mb-6">Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={simulationData.risk_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ risk_level, percentage }) => `${risk_level}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {simulationData.risk_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-2xl font-semibold mb-6">Risk Profile Analysis</h3>
                <div className="space-y-4">
                  {simulationData.risk_distribution.map((risk, index) => (
                    <div key={risk.risk_level} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{risk.risk_level} Risk</span>
                        <span className="text-sm text-gray-600">{risk.percentage}%</span>
                      </div>
                      <div className="progress-bar mb-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${risk.percentage}%`, 
                            backgroundColor: COLORS[index % COLORS.length] 
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(risk.amount)} invested
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Education */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-success-600 text-xl">📈</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Low Risk</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Stable returns</li>
                  <li>• Lower volatility</li>
                  <li>• Conservative growth</li>
                  <li>• Principal protection</li>
                </ul>
              </div>
              
              <div className="card">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-warning-600 text-xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Medium Risk</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Balanced approach</li>
                  <li>• Moderate volatility</li>
                  <li>• Growth potential</li>
                  <li>• Diversified exposure</li>
                </ul>
              </div>
              
              <div className="card">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-danger-600 text-xl">🚀</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">High Risk</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High return potential</li>
                  <li>• Significant volatility</li>
                  <li>• Innovation focus</li>
                  <li>• Higher uncertainty</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Market Trends Tab */}
        {activeTab === 'market' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-2xl font-semibold mb-6">Market Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationData.market_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="market_index" stroke="#94A3B8" strokeWidth={2} name="Market Index" />
                  <Line type="monotone" dataKey="your_portfolio" stroke="#3B82F6" strokeWidth={2} name="Your Portfolio" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Market Insights */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h4 className="text-lg font-semibold mb-4">Market Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Volatility:</span>
                    <span className="font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trend Direction:</span>
                    <span className="font-medium text-success-600">Upward</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Portfolio Performance:</span>
                    <span className="font-medium text-success-600">Outperforming</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="font-medium">Balanced</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="text-lg font-semibold mb-4">Investment Tips</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-success-600 mr-2">✓</span>
                    Diversify across different risk levels
                  </li>
                  <li className="flex items-start">
                    <span className="text-success-600 mr-2">✓</span>
                    Stay invested during market volatility
                  </li>
                  <li className="flex items-start">
                    <span className="text-success-600 mr-2">✓</span>
                    Regular investments beat timing the market
                  </li>
                  <li className="flex items-start">
                    <span className="text-success-600 mr-2">✓</span>
                    Review and rebalance periodically
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Economic Impact Tab */}
        {activeTab === 'impact' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold text-primary-600">{formatNumber(simulationData.economic_impact.jobs_created)}</div>
                <div className="text-sm text-gray-600">Jobs Created</div>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold text-success-600">{formatCurrency(simulationData.economic_impact.local_revenue_generated)}</div>
                <div className="text-sm text-gray-600">Local Revenue</div>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-2">🏢</div>
                <div className="text-3xl font-bold text-warning-600">{formatNumber(simulationData.economic_impact.businesses_supported)}</div>
                <div className="text-sm text-gray-600">Businesses Supported</div>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-2">🌍</div>
                <div className="text-3xl font-bold text-purple-600">{formatNumber(simulationData.economic_impact.community_projects_funded)}</div>
                <div className="text-sm text-gray-600">Community Projects</div>
              </div>
            </div>

            {/* Impact Stories */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card">
                <h4 className="text-lg font-semibold mb-4">Your Impact Story</h4>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Through your investments, you've helped create <span className="font-semibold text-primary-600">{simulationData.economic_impact.jobs_created} new jobs</span> in your local community.
                  </p>
                  <p>
                    Your support has generated <span className="font-semibold text-success-600">{formatCurrency(simulationData.economic_impact.local_revenue_generated)}</span> in local economic activity, strengthening the community's economic foundation.
                  </p>
                  <p>
                    You've directly supported <span className="font-semibold text-warning-600">{simulationData.economic_impact.businesses_supported} local businesses</span> and helped fund <span className="font-semibold text-purple-600">{simulationData.economic_impact.community_projects_funded} community projects</span>.
                  </p>
                </div>
              </div>

              <div className="card">
                <h4 className="text-lg font-semibold mb-4">Economic Multiplier Effect</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direct Investment:</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Economic Multiplier:</span>
                    <span className="font-medium">2.4x</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total Economic Impact:</span>
                    <span className="font-semibold text-success-600">$24,000</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Every dollar you invest creates additional economic activity through spending, hiring, and local supply chains.
                </p>
              </div>
            </div>

            {/* Learning Section */}
            <div className="card">
              <h4 className="text-lg font-semibold mb-4">Understanding Economic Impact</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-medium text-primary-600 mb-2">Direct Impact</h5>
                  <p className="text-sm text-gray-600">
                    Your investment directly funds business operations, equipment, and initial hiring.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-success-600 mb-2">Indirect Impact</h5>
                  <p className="text-sm text-gray-600">
                    Businesses use your investment to purchase from local suppliers, creating a ripple effect.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-warning-600 mb-2">Induced Impact</h5>
                  <p className="text-sm text-gray-600">
                    Employees spend their wages locally, further stimulating the economic ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;