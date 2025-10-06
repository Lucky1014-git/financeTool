import React, { useState } from 'react';

const FinancialLiteracy = () => {
  const [activeSection, setActiveSection] = useState('basics');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  // Calculator state
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(10);
  const [compounding, setCompounding] = useState(12);

  const sections = [
    { id: 'basics', label: 'Financial Basics', icon: '💰' },
    { id: 'investing', label: 'Investing 101', icon: '📈' },
    { id: 'risk', label: 'Risk & Return', icon: '⚖️' },
    { id: 'planning', label: 'Financial Planning', icon: '📋' },
    { id: 'glossary', label: 'Glossary', icon: '📚' }
  ];

  const quizQuestions = [
    {
      question: "What is compound interest?",
      options: [
        "Interest calculated only on the principal amount",
        "Interest calculated on principal plus previously earned interest",
        "A type of loan with fixed payments",
        "The fee banks charge for account maintenance"
      ],
      correct: 1,
      explanation: "Compound interest is earning interest on both your original money and previously earned interest, creating a snowball effect for wealth building."
    },
    {
      question: "If you invest $100 and get back $120, what is your ROI?",
      options: ["12%", "20%", "25%", "15%"],
      correct: 1,
      explanation: "ROI = (Final Value - Initial Investment) / Initial Investment × 100% = ($120 - $100) / $100 × 100% = 20%"
    },
    {
      question: "What does diversification mean in investing?",
      options: [
        "Putting all money in one investment",
        "Only investing in safe government bonds",
        "Spreading investments across different assets",
        "Waiting for the perfect time to invest"
      ],
      correct: 2,
      explanation: "Diversification means spreading your investments across different types of assets to reduce overall risk while maintaining growth potential."
    },
    {
      question: "Which typically offers higher potential returns but also higher risk?",
      options: ["Savings accounts", "Government bonds", "Stocks", "Certificates of deposit"],
      correct: 2,
      explanation: "Stocks generally offer higher potential returns than savings accounts or bonds, but they also come with higher risk and volatility."
    },
    {
      question: "What is inflation?",
      options: [
        "When your investments lose value",
        "When prices of goods and services increase over time",
        "The interest rate on savings accounts",
        "A type of investment strategy"
      ],
      correct: 1,
      explanation: "Inflation is when the general price level of goods and services increases over time, reducing the purchasing power of money."
    }
  ];

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(compounding);
    const t = parseFloat(time);
    
    const amount = P * Math.pow((1 + r/n), (n * t));
    const interest = amount - P;
    
    return {
      finalAmount: amount.toFixed(2),
      totalInterest: interest.toFixed(2)
    };
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizScore(null);
  };

  const selectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateQuizScore();
    }
  };

  const calculateQuizScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++;
      }
    });
    setQuizScore((correct / quizQuestions.length) * 100);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizScore(null);
  };

  const financialConcepts = {
    basics: [
      {
        title: 'What is Money?',
        definition: 'Money is a medium of exchange that allows us to trade goods and services.',
        explanation: 'Think of money as a tool that makes trading easier. Instead of bartering (trading a chicken for bread), we use money as a common way to measure value.',
        example: 'If you have $10, you can buy a sandwich worth $10, or save it to buy something more expensive later.',
        importance: 'Understanding money helps you make better decisions about spending and saving.'
      },
      {
        title: 'Interest',
        definition: 'Interest is the cost of borrowing money or the reward for saving money.',
        explanation: 'When you put money in a savings account, the bank pays you interest. When you borrow money, you pay interest to the lender.',
        example: 'If you put $100 in a savings account with 5% annual interest, after one year you\'ll have $105.',
        importance: 'Interest helps your money grow over time when saving, but costs you extra when borrowing.'
      },
      {
        title: 'Compound Interest',
        definition: 'Compound interest is earning interest on both your original money and previously earned interest.',
        explanation: 'It\'s like a snowball effect - your money grows faster and faster over time because you earn interest on your interest.',
        example: 'Year 1: $100 → $105 (earned $5). Year 2: $105 → $110.25 (earned $5.25 on the larger amount).',
        importance: 'Compound interest is incredibly powerful for building wealth over time. Start early!'
      },
      {
        title: 'Inflation',
        definition: 'Inflation is when the general price of goods and services increases over time.',
        explanation: 'This means your money can buy less in the future than it can today.',
        example: 'If inflation is 3% per year, something that costs $100 today will cost $103 next year.',
        importance: 'Understanding inflation helps you make better long-term financial decisions.'
      }
    ],
    investing: [
      {
        title: 'What is Investing?',
        definition: 'Investing is putting money into something with the expectation of earning a profit.',
        explanation: 'Instead of just saving money, you use it to buy assets that might grow in value or generate income.',
        example: 'Buying shares of a company, investing in a local business, or purchasing real estate.',
        importance: 'Investing helps your money grow faster than traditional savings accounts.'
      },
      {
        title: 'ROI (Return on Investment)',
        definition: 'ROI measures how much profit you make compared to how much you invested.',
        explanation: 'It\'s calculated as: (Profit - Investment Cost) ÷ Investment Cost × 100%',
        example: 'If you invest $100 and get back $120, your ROI is: ($120 - $100) ÷ $100 × 100% = 20%',
        importance: 'ROI helps you compare different investment opportunities to see which might be better.'
      },
      {
        title: 'Stocks',
        definition: 'Stocks represent ownership shares in a company.',
        explanation: 'When you buy stocks, you become a partial owner of that company and can benefit from its success.',
        example: 'If you buy Apple stock, you own a tiny piece of Apple Inc. and benefit when the company does well.',
        importance: 'Stocks can provide good long-term returns but can be volatile in the short term.'
      },
      {
        title: 'Bonds',
        definition: 'Bonds are loans you give to companies or governments in exchange for regular interest payments.',
        explanation: 'It\'s like being the bank - you lend money and get paid interest until the bond matures.',
        example: 'You buy a $1,000 government bond that pays 3% annually. You\'ll receive $30 per year and get your $1,000 back at the end.',
        importance: 'Bonds are generally safer than stocks but typically offer lower returns.'
      }
    ],
    risk: [
      {
        title: 'What is Risk?',
        definition: 'Risk is the chance that an investment might lose money or not perform as expected.',
        explanation: 'All investments carry some risk - there\'s no guarantee you\'ll make money.',
        example: 'A startup company might fail and you could lose your entire investment, or it might succeed and make you rich.',
        importance: 'Understanding risk helps you make informed decisions about where to put your money.'
      },
      {
        title: 'Risk vs. Return',
        definition: 'Generally, investments with higher potential returns come with higher risk.',
        explanation: 'This is the fundamental trade-off in investing - you can\'t get high returns without taking on more risk.',
        example: 'Savings accounts are low risk but low return. Stocks are higher risk but potentially higher return.',
        importance: 'Balancing risk and return based on your goals and comfort level is key to successful investing.'
      },
      {
        title: 'Diversification',
        definition: 'Diversification means spreading your investments across different types of assets.',
        explanation: 'Don\'t put all your eggs in one basket - if one investment fails, others might succeed.',
        example: 'Instead of investing everything in one company, invest in multiple companies across different industries.',
        importance: 'Diversification can help reduce overall risk while maintaining growth potential.'
      },
      {
        title: 'Risk Tolerance',
        definition: 'Risk tolerance is how much investment risk you\'re comfortable taking.',
        explanation: 'Some people can handle watching their investments go up and down, others prefer stability.',
        example: 'Conservative investors might prefer bonds and savings. Aggressive investors might choose stocks and startups.',
        importance: 'Knowing your risk tolerance helps you choose investments that match your personality and goals.'
      }
    ],
    planning: [
      {
        title: 'Financial Goals',
        definition: 'Financial goals are specific objectives you want to achieve with your money.',
        explanation: 'Having clear goals helps you make better financial decisions and stay motivated.',
        example: 'Short-term: Save $500 for a new phone. Long-term: Save $10,000 for college.',
        importance: 'Clear goals help you prioritize spending and choose appropriate investment strategies.'
      },
      {
        title: 'Budgeting',
        definition: 'A budget is a plan for how you\'ll spend and save your money.',
        explanation: 'It helps ensure you don\'t spend more than you earn and that you\'re saving for your goals.',
        example: 'Income: $100/month. Expenses: $60. Savings: $40. This leaves you on track for your goals.',
        importance: 'Budgeting is the foundation of good financial health and helps you reach your goals faster.'
      },
      {
        title: 'Emergency Fund',
        definition: 'An emergency fund is money set aside for unexpected expenses.',
        explanation: 'Life is unpredictable - having money saved for emergencies prevents you from going into debt.',
        example: 'Your phone breaks, your car needs repair, or you lose your job. An emergency fund covers these costs.',
        importance: 'An emergency fund provides financial security and peace of mind.'
      },
      {
        title: 'Time Value of Money',
        definition: 'Money available now is worth more than the same amount in the future.',
        explanation: 'This is because money can earn interest over time, and inflation reduces purchasing power.',
        example: '$100 today can be invested to become $105 next year, so $100 today > $100 next year.',
        importance: 'Understanding this concept helps you make better decisions about spending vs. investing.'
      }
    ]
  };

  const glossaryTerms = [
    { term: 'Asset', definition: 'Something valuable that you own, like stocks, bonds, or real estate.' },
    { term: 'Capital', definition: 'Money or assets used to generate income or invest in opportunities.' },
    { term: 'Dividend', definition: 'A payment made by companies to shareholders from their profits.' },
    { term: 'Equity', definition: 'Ownership in a company, represented by shares of stock.' },
    { term: 'Liquidity', definition: 'How quickly and easily an asset can be converted to cash.' },
    { term: 'Market Cap', definition: 'The total value of a company\'s shares in the stock market.' },
    { term: 'Portfolio', definition: 'A collection of investments owned by an individual or institution.' },
    { term: 'Principal', definition: 'The original amount of money invested or borrowed.' },
    { term: 'Volatility', definition: 'How much the price of an investment goes up and down over time.' },
    { term: 'Yield', definition: 'The income return on an investment, usually expressed as a percentage.' }
  ];

  const ConceptCard = ({ concept }) => (
    <div className="card mb-6">
      <h3 className="text-xl font-bold text-primary-600 mb-3">{concept.title}</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Definition:</h4>
          <p className="text-gray-600">{concept.definition}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">How it works:</h4>
          <p className="text-gray-600">{concept.explanation}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Example:</h4>
          <p className="text-blue-700">{concept.example}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-1">Why it matters:</h4>
          <p className="text-green-700">{concept.importance}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Financial Literacy Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the fundamentals of finance and investing. Build the knowledge you need to make smart financial decisions for life.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 mx-1 mb-2 rounded-lg font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto">
          {activeSection === 'glossary' ? (
            /* Glossary Section */
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Financial Terms Glossary</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {glossaryTerms.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-primary-600 mb-2">{item.term}</h3>
                    <p className="text-gray-600 text-sm">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Concept Sections */
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                <p className="text-gray-600">
                  {activeSection === 'basics' && 'Start here to understand fundamental financial concepts that form the foundation of financial literacy.'}
                  {activeSection === 'investing' && 'Learn about different ways to grow your money through investments and understand key investment concepts.'}
                  {activeSection === 'risk' && 'Understand the relationship between risk and return, and learn how to manage investment risk effectively.'}
                  {activeSection === 'planning' && 'Develop skills for setting financial goals, budgeting, and making smart long-term financial decisions.'}
                </p>
              </div>

              {financialConcepts[activeSection]?.map((concept, index) => (
                <ConceptCard key={index} concept={concept} />
              ))}
            </div>
          )}
        </div>

        {/* Interactive Quiz and Calculator Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Interactive Learning Tools</h2>
            <p className="text-gray-600 mb-6">
              Test your knowledge and see compound interest in action with our interactive tools.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="font-semibold mb-2">Financial Literacy Quiz</h3>
                <p className="text-sm text-gray-600 mb-4">Test your knowledge with 5 questions on key financial concepts</p>
                <button 
                  onClick={startQuiz}
                  className="btn-primary"
                >
                  Start Quiz
                </button>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold mb-2">Compound Interest Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">See how your money can grow over time with compound interest</p>
                <button 
                  onClick={() => setShowCalculator(true)}
                  className="btn-success"
                >
                  Open Calculator
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">💡 Quick Tips for Young Investors</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">✅ DO</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Start investing early, even with small amounts</li>
                  <li>• Diversify your investments across different assets</li>
                  <li>• Keep learning about finance and investing</li>
                  <li>• Set clear financial goals and stick to them</li>
                  <li>• Build an emergency fund before investing</li>
                  <li>• Invest in what you understand</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 mb-2">❌ DON'T</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Put all your money in one investment</li>
                  <li>• Panic sell when markets go down</li>
                  <li>• Try to time the market perfectly</li>
                  <li>• Invest money you need in the short term</li>
                  <li>• Follow investment fads without research</li>
                  <li>• Ignore fees and expenses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        {showQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto p-6">
              {quizScore === null ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Financial Literacy Quiz</h3>
                    <button 
                      onClick={resetQuiz}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                      {quizQuestions[currentQuestion].question}
                    </h4>
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(currentQuestion, index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={resetQuiz}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={nextQuestion}
                      disabled={selectedAnswers[currentQuestion] === undefined}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {quizScore >= 80 ? '🎉' : quizScore >= 60 ? '👍' : '📚'}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {quizScore.toFixed(0)}%
                  </div>
                  <p className="text-gray-600 mb-6">
                    {quizScore >= 80 ? 'Excellent! You have a strong grasp of financial concepts.' :
                     quizScore >= 60 ? 'Good job! Consider reviewing some concepts to improve.' :
                     'Keep learning! Review the educational content and try again.'}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">Review Your Answers:</h4>
                    <div className="space-y-3 text-left">
                      {quizQuestions.map((question, index) => (
                        <div key={index} className="border-b border-gray-200 pb-2">
                          <p className="font-medium text-sm mb-1">{question.question}</p>
                          <div className="flex items-center gap-2">
                            <span className={selectedAnswers[index] === question.correct ? 'text-green-600' : 'text-red-600'}>
                              {selectedAnswers[index] === question.correct ? '✓' : '✗'}
                            </span>
                            <span className="text-sm text-gray-600">
                              Your answer: {question.options[selectedAnswers[index]]}
                            </span>
                          </div>
                          {selectedAnswers[index] !== question.correct && (
                            <p className="text-xs text-gray-500 mt-1">{question.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button onClick={resetQuiz} className="btn-secondary">
                      Close
                    </button>
                    <button onClick={() => { setQuizScore(null); setCurrentQuestion(0); setSelectedAnswers({}); }} className="btn-primary">
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calculator Modal */}
        {showCalculator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Compound Interest Calculator</h3>
                <button 
                  onClick={() => setShowCalculator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Investment ($)
                  </label>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period (years)
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compounding Frequency
                  </label>
                  <select
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="1">Annually</option>
                    <option value="4">Quarterly</option>
                    <option value="12">Monthly</option>
                    <option value="365">Daily</option>
                  </select>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4 text-center">Results</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">
                      ${calculateCompoundInterest().finalAmount}
                    </div>
                    <div className="text-sm text-gray-600">Final Amount</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${calculateCompoundInterest().totalInterest}
                    </div>
                    <div className="text-sm text-gray-600">Interest Earned</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600">
                    Growth: {(((calculateCompoundInterest().finalAmount / principal) - 1) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-blue-800 mb-2">💡 Key Insights:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Starting early gives compound interest more time to work</li>
                  <li>• Higher interest rates significantly boost long-term growth</li>
                  <li>• More frequent compounding increases returns</li>
                  <li>• Even small amounts can grow substantially over time</li>
                </ul>
              </div>
              
              <button 
                onClick={() => setShowCalculator(false)}
                className="w-full btn-primary"
              >
                Close Calculator
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialLiteracy;