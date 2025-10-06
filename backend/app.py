from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
from models import Database

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database
db = Database()

@app.route('/')
def index():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Youth Micro-Investing Platform API',
        'version': '1.0.0'
    })

@app.route('/projects', methods=['GET'])
def get_projects():
    """Get all available investment projects"""
    try:
        projects = db.get_projects()
        
        # Add some dynamic data for realism
        for project in projects:
            # Calculate funding percentage
            project['funding_percentage'] = (project['current_funding'] / project['funding_goal']) * 100
            
            # Simulate some market volatility for current values
            volatility = random.uniform(-0.05, 0.05)  # ±5% volatility
            project['current_market_value'] = project['current_funding'] * (1 + volatility)
            
            # Add time remaining (random for demo)
            project['days_remaining'] = random.randint(15, 90)
            
            # Add investor count (simulated)
            project['investor_count'] = random.randint(5, 50)
        
        return jsonify({
            'success': True,
            'projects': projects,
            'total_projects': len(projects)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching projects: {str(e)}'
        }), 500

@app.route('/invest', methods=['POST'])
def invest_in_project():
    """Invest virtual capital in a project"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        project_id = data.get('project_id')
        amount = data.get('amount')
        user_id = data.get('user_id', 1)  # Default to user 1 for demo
        
        if not project_id or not amount:
            return jsonify({
                'success': False,
                'message': 'Project ID and amount are required'
            }), 400
        
        if amount <= 0:
            return jsonify({
                'success': False,
                'message': 'Investment amount must be positive'
            }), 400
        
        # Make the investment
        result = db.make_investment(user_id, project_id, amount)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Investment successful!',
                'investment': {
                    'project_id': project_id,
                    'amount': amount,
                    'timestamp': time.time()
                }
            })
        else:
            return jsonify(result), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error processing investment: {str(e)}'
        }), 500

@app.route('/portfolio', methods=['GET'])
def get_portfolio():
    """Get user's investment portfolio"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        portfolio = db.get_portfolio(user_id)
        
        if not portfolio['user']:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Simulate investment growth/loss over time
        for investment in portfolio['investments']:
            # Simple simulation: random daily change based on risk level
            days_since_investment = random.randint(1, 30)  # Simulate time passage
            
            risk_multiplier = {
                'Low': 0.002,    # 0.2% daily volatility
                'Medium': 0.005, # 0.5% daily volatility
                'High': 0.01     # 1% daily volatility
            }.get(investment['risk_level'], 0.005)
            
            # Calculate simulated returns
            expected_daily_return = investment['expected_roi'] / 365 / 100
            random_factor = random.uniform(-risk_multiplier, risk_multiplier)
            daily_return = expected_daily_return + random_factor
            
            # Update current value
            investment['current_value'] = investment['amount'] * (1 + daily_return * days_since_investment)
            investment['return_percentage'] = ((investment['current_value'] - investment['amount']) / investment['amount']) * 100
            investment['return_amount'] = investment['current_value'] - investment['amount']
        
        # Recalculate totals
        total_current_value = sum(inv['current_value'] for inv in portfolio['investments'])
        total_return = total_current_value - portfolio['total_invested']
        total_return_percentage = (total_return / portfolio['total_invested'] * 100) if portfolio['total_invested'] > 0 else 0
        
        portfolio['current_value'] = total_current_value
        portfolio['total_return'] = total_return
        portfolio['total_return_percentage'] = total_return_percentage
        
        # Add portfolio diversity metrics
        categories = {}
        for inv in portfolio['investments']:
            category = inv['category']
            if category not in categories:
                categories[category] = 0
            categories[category] += inv['amount']
        
        portfolio['diversification'] = categories
        
        return jsonify({
            'success': True,
            'portfolio': portfolio
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching portfolio: {str(e)}'
        }), 500

@app.route('/simulation', methods=['GET'])
def get_simulation_data():
    """Get simulation data for charts and economic impact visualization"""
    try:
        # Generate mock historical data for charts
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        
        # Portfolio growth simulation
        portfolio_growth = []
        base_value = 10000
        for i, month in enumerate(months):
            # Simulate portfolio growth with some volatility
            growth_rate = random.uniform(0.01, 0.03)  # 1-3% monthly growth
            base_value *= (1 + growth_rate)
            portfolio_growth.append({
                'month': month,
                'value': round(base_value, 2),
                'invested': 10000 + (i * 500)  # Assume regular investments
            })
        
        # Risk distribution data
        risk_distribution = [
            {'risk_level': 'Low', 'percentage': 30, 'amount': 3000},
            {'risk_level': 'Medium', 'percentage': 50, 'amount': 5000},
            {'risk_level': 'High', 'percentage': 20, 'amount': 2000}
        ]
        
        # Economic impact simulation
        economic_impact = {
            'jobs_created': random.randint(15, 25),
            'local_revenue_generated': random.randint(50000, 100000),
            'businesses_supported': random.randint(6, 12),
            'community_projects_funded': random.randint(3, 8)
        }
        
        # Market trends
        market_trends = []
        for i in range(30):  # Last 30 days
            market_trends.append({
                'day': i + 1,
                'market_index': 100 + random.uniform(-5, 10),  # Base 100 with volatility
                'your_portfolio': 100 + random.uniform(-3, 12)  # Slightly better performance
            })
        
        return jsonify({
            'success': True,
            'simulation_data': {
                'portfolio_growth': portfolio_growth,
                'risk_distribution': risk_distribution,
                'economic_impact': economic_impact,
                'market_trends': market_trends
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating simulation data: {str(e)}'
        }), 500

@app.route('/user/balance', methods=['GET'])
def get_user_balance():
    """Get current user balance"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        user = db.get_user(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'balance': user['balance'],
            'user': user
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching user balance: {str(e)}'
        }), 500

@app.route('/user/reset-balance', methods=['POST'])
def reset_user_balance():
    """Reset user balance to default amount"""
    try:
        user_id = request.json.get('user_id', 1) if request.json else 1
        default_balance = 10000.0
        
        # Update user balance in database
        updated = db.update_user_balance(user_id, default_balance)
        
        if not updated:
            return jsonify({
                'success': False,
                'message': 'Failed to reset balance'
            }), 400
        
        return jsonify({
            'success': True,
            'balance': default_balance,
            'message': 'Balance successfully reset to $10,000'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error resetting balance: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting Youth Micro-Investing Platform API...")
    print("Database initialized with mock projects")
    print("Server running at http://localhost:5000")
    print("API Documentation:")
    print("   GET  /projects - List all investment projects")
    print("   POST /invest   - Make an investment")
    print("   GET  /portfolio - Get user portfolio")
    print("   GET  /simulation - Get simulation data")
    print("   GET  /user/balance - Get user balance")
    
    app.run(debug=True, host='0.0.0.0', port=5000)