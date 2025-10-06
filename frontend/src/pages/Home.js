import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Virtual Investing',
      description: 'Learn investment fundamentals with virtual capital and real market principles.'
    },
    {
      icon: '🏢',
      title: 'Simulated Local Businesses',
      description: 'Invest in educational simulations of local businesses like cafes, bookstores, and tech startups.'
    },
    {
      icon: '📚',
      title: 'Financial Education',
      description: 'Master key concepts like ROI, compound interest, risk management, and portfolio diversification.'
    },
    {
      icon: '💡',
      title: 'Economic Impact',
      description: 'Learn how investments stimulate economic activity through educational simulations.'
    }
  ];





  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="bg-blue-200 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold">
              Educational Platform - Simulated Investing Experience
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Youth Micro-Investing 
            <span className="block text-yellow-400">Simulator</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Learn investing fundamentals through <strong>simulated local business investments</strong>. 
            Build financial literacy with virtual capital in a safe, educational environment.
          </p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-8 max-w-4xl mx-auto">
            <p className="font-semibold">📚 Important: This is an Educational Simulation Platform</p>
            <p className="text-sm mt-1">
              All investments and businesses featured are simulated for educational purposes. 
              No real money is involved. Learn, practice, and build confidence before real-world investing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/projects" 
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Learning Now
            </Link>
            <Link 
              to="/learn" 
              className="border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Explore Financial Education
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Learn Through Simulation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our educational platform uses realistic business simulations to teach investing concepts
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>








    </div>
  );
};

export default Home;