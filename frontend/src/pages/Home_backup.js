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
      title: 'Simulated Local Projects',
      description: 'Practice investing in realistic simulated community businesses and startups for educational purposes.'
    },
    {
      icon: '📊',
      title: 'Risk Management',
      description: 'Understand different risk levels and their impact on returns.'
    },
    {
      icon: '📚',
      title: 'Financial Literacy',
      description: 'Master essential concepts like ROI, compound interest, and diversification.'
    },
    {
      icon: '💡',
      title: 'Economic Impact Simulation',
      description: 'Learn how investments stimulate economic activity through educational simulations.'
    }
  ];

  const stats = [
    { label: 'Simulated Projects', value: '6', icon: '🚀' },
    { label: 'Virtual Capital', value: '$10K', icon: '💰' },
    { label: 'Learning Modules', value: '5', icon: '👥' },
    { label: 'Educational Focus', value: '100%', icon: '📈' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-pulse-slow">
              Learn Investing Through
              <span className="block text-yellow-300">Educational Simulation</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100">
              Master the fundamentals of micro-investing through realistic simulations of local businesses and startups. 
              Build financial knowledge while understanding community economic impact.
              <br />
              <span className="text-lg opacity-90 italic">*All businesses and investments are simulated for educational purposes only*</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/projects"
                className="btn-primary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-100"
              >
                Explore Simulated Projects 🚀
              </Link>
              <Link
                to="/learn"
                className="btn-secondary text-lg px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Learn Basics 📚
              </Link>
              <Link
                to="/simulation"
                className="btn-secondary text-lg px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600"
              >
                View Simulation 📊
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Disclaimer */}
      <section className="py-4 bg-blue-50 border-b-2 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-blue-800 font-medium">
              🎓 <strong>Educational Platform:</strong> All businesses, investments, and returns are simulated for learning purposes. 
              No real money is involved. Practice safely and build financial literacy!
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary-600 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Educational Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make learning about investing fun, safe, and practical through realistic simulations designed for educational excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Educational Simulation Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn investing fundamentals through three simple steps in our safe, educational environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                1️⃣
              </div>
              <h3 className="text-2xl font-semibold mb-4">Explore Simulated Projects</h3>
              <p className="text-gray-600">
                Browse realistic simulated local business opportunities with different risk levels and expected returns. 
                Learn about each project's goals and community impact through educational scenarios.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                2️⃣
              </div>
              <h3 className="text-2xl font-semibold mb-4">Practice Virtual Investing</h3>
              <p className="text-gray-600">
                Allocate your virtual capital across different simulated projects. Learn about diversification and risk management 
                in a safe educational environment with no real money at risk.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                3️⃣
              </div>
              <h3 className="text-2xl font-semibold mb-4">Track & Learn</h3>
              <p className="text-gray-600">
                Monitor your simulated portfolio growth, analyze educational performance metrics, and understand market dynamics 
                through interactive charts and learning simulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Educational Investment Journey?</h2>
          <p className="text-xl mb-8">
            Join students learning to understand wealth building through smart investing concepts. 
            Start with virtual money, gain real financial knowledge through educational simulations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects" className="btn-primary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-100">
              Start Learning Now 💰
            </Link>
            <Link to="/learn" className="btn-secondary text-lg px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Study the Basics First 📚
            </Link>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="text-sm">
              <strong>🎓 100% Educational • 💰 No Real Money Required • 🛡️ Risk-Free Learning Environment</strong>
              <br />
              <span className="text-xs opacity-90">
                All businesses, projects, and investment returns are simulated for educational purposes only. 
                This platform is designed to teach financial concepts in a safe learning environment.
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;