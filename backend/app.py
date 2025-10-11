from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import time
from models import Database

"""
Youth Micro-Investing Platform API

A Flask-based REST API for a youth investing education platform that allows
teenagers to learn about investing through simulated micro-investments in 
local businesses.

API Documentation:
    Base URL: http://localhost:5000
    Content-Type: application/json
    
Endpoints:
    - GET  /health                     - Health check
    - GET  /projects                   - List investment projects
    - POST /invest                     - Make an investment
    - GET  /portfolio                  - Get user portfolio
    - GET  /simulation                 - Get simulation data for charts
    - GET  /user/balance              - Get user balance
    - POST /user/reset-balance        - Reset user balance and investments
    - POST /user/update-investments   - Update investment values
    - GET  /user/investment-performance - Get investment performance summary
"""

#app = Flask(__name__)
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")

CORS(app)  # Enable CORS for all routes

# Initialize database

db = Database()

@app.route("/") 
def serve_index(): 
    """
    Serve the React frontend application
    
    Returns:
        HTML: The main React application index.html file
    """
    return send_from_directory(app.static_folder, "index.html")

@app.route('/health', methods=['GET'])
def index():
    """
    Health check endpoint for monitoring and deployment
    
    Returns:
        200 JSON: Health status information
        
    Response Schema:
        {
            "status": "healthy",
            "message": "Youth Micro-Investing Platform API",
            "version": "1.0.0"
        }
    
    Example:
        GET /health
        Response: 200 OK
        {
            "status": "healthy",
            "message": "Youth Micro-Investing Platform API",
            "version": "1.0.0"
        }
    """
    return jsonify({
        'status': 'healthy',
        'message': 'Youth Micro-Investing Platform API',
        'version': '1.0.0'
    })

@app.route('/projects', methods=['GET'])
def get_projects():
    """
    Get all available investment projects
    
    Returns a list of all simulated local businesses available for investment.
    Each project includes details about the business, funding status, risk level,
    and expected return on investment.
    
    Query Parameters:
        category (optional): Filter projects by category (e.g., "food", "tech", "retail")
        min_funding (optional): Minimum funding percentage
        max_funding (optional): Maximum funding percentage
    
    Returns:
        200 JSON: Success response with projects data
        500 JSON: Server error
        
    Response Schema:
        {
            "success": true,
            "projects": [
                {
                    "id": <int>,
                    "name": <string>,
                    "description": <string>,
                    "category": <string>,
                    "funding_goal": <float>,
                    "current_funding": <float>,
                    "funding_percentage": <float>,
                    "expected_roi": <float>,
                    "risk_level": "Low" | "Medium" | "High",
                    "min_investment": <float>
                }
            ],
            "total_projects": <int>
        }
        
    Example:
        GET /projects
        Response: 200 OK
        {
            "success": true,
            "projects": [
                {
                    "id": 1,
                    "name": "Green Leaf Cafe",
                    "description": "Organic coffee shop focusing on sustainability",
                    "category": "food",
                    "funding_goal": 25000.0,
                    "current_funding": 18750.0,
                    "funding_percentage": 75.0,
                    "expected_roi": 12.0,
                    "risk_level": "Medium",
                    "min_investment": 50.0
                }
            ],
            "total_projects": 12
        }
        
    Error Response:
        {
            "success": false,
            "message": "Error fetching projects: <error_details>"
        }
    """
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
    """
    Invest virtual capital in a project
    
    Allows users to make investments in available projects. Validates the investment
    amount against user balance and project requirements. Updates user balance and
    project funding upon successful investment.
    
    Request Body:
        {
            "project_id": <int> (required) - ID of the project to invest in,
            "amount": <float> (required) - Investment amount in USD,
            "user_id": <int> (optional) - User ID, defaults to 1
        }
    
    Returns:
        200 JSON: Successful investment
        400 JSON: Bad request (validation errors, insufficient funds)
        500 JSON: Server error
        
    Response Schema (Success):
        {
            "success": true,
            "message": "Investment successful!",
            "investment": {
                "project_id": <int>,
                "amount": <float>,
                "timestamp": <unix_timestamp>
            }
        }
        
    Response Schema (Error):
        {
            "success": false,
            "message": <string>
        }
    
    Validation Rules:
        - project_id and amount are required
        - amount must be positive
        - user must have sufficient balance
        - project must exist and be available for investment
        - amount must meet minimum investment requirement
        
    Example:
        POST /invest
        Request:
        {
            "project_id": 1,
            "amount": 500.0,
            "user_id": 1
        }
        
        Response: 200 OK
        {
            "success": true,
            "message": "Investment successful!",
            "investment": {
                "project_id": 1,
                "amount": 500.0,
                "timestamp": 1640995200.0
            }
        }
        
    Error Examples:
        - Insufficient funds: {"success": false, "message": "Insufficient funds"}
        - Invalid amount: {"success": false, "message": "Investment amount must be positive"}
        - Missing data: {"success": false, "message": "Project ID and amount are required"}
    """
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
    """
    Get user's investment portfolio
    
    Returns comprehensive portfolio data including current investments, performance
    metrics, diversification analysis, and simulated returns based on time elapsed
    and risk factors.
    
    Query Parameters:
        user_id (optional): User ID, defaults to 1
    
    Returns:
        200 JSON: Portfolio data with performance calculations
        404 JSON: User not found
        500 JSON: Server error
        
    Response Schema:
        {
            "success": true,
            "portfolio": {
                "user": {
                    "id": <int>,
                    "balance": <float>
                },
                "investments": [
                    {
                        "id": <int>,
                        "project_id": <int>,
                        "project_name": <string>,
                        "category": <string>,
                        "amount": <float>,
                        "current_value": <float>,
                        "return_amount": <float>,
                        "return_percentage": <float>,
                        "risk_level": "Low" | "Medium" | "High",
                        "expected_roi": <float>,
                        "investment_date": <string>
                    }
                ],
                "total_invested": <float>,
                "current_value": <float>,
                "total_return": <float>,
                "total_return_percentage": <float>,
                "diversification": {
                    "<category>": <float>
                }
            }
        }
        
    Example:
        GET /portfolio?user_id=1
        Response: 200 OK
        {
            "success": true,
            "portfolio": {
                "user": {"id": 1, "balance": 9500.0},
                "investments": [
                    {
                        "id": 1,
                        "project_id": 1,
                        "project_name": "Green Leaf Cafe",
                        "category": "food",
                        "amount": 500.0,
                        "current_value": 515.0,
                        "return_amount": 15.0,
                        "return_percentage": 3.0,
                        "risk_level": "Medium",
                        "expected_roi": 12.0,
                        "investment_date": "2024-01-01"
                    }
                ],
                "total_invested": 500.0,
                "current_value": 515.0,
                "total_return": 15.0,
                "total_return_percentage": 3.0,
                "diversification": {"food": 500.0}
            }
        }
        
    Notes:
        - Current values are simulated based on time elapsed, risk level, and market volatility
        - Return calculations include both positive and negative scenarios
        - Diversification shows investment distribution across categories
    """
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
    """
    Get simulation data for charts and economic impact visualization
    
    Provides mock data for various charts and visualizations in the frontend,
    including portfolio growth over time, risk distribution, economic impact
    metrics, and market trend comparisons.
    
    Returns:
        200 JSON: Comprehensive simulation data for visualizations
        500 JSON: Server error
        
    Response Schema:
        {
            "success": true,
            "simulation_data": {
                "portfolio_growth": [
                    {
                        "month": <string>,
                        "value": <float>,
                        "invested": <float>
                    }
                ],
                "risk_distribution": [
                    {
                        "risk_level": "Low" | "Medium" | "High",
                        "percentage": <float>,
                        "amount": <float>
                    }
                ],
                "economic_impact": {
                    "jobs_created": <int>,
                    "local_revenue_generated": <float>,
                    "businesses_supported": <int>,
                    "community_projects_funded": <int>
                },
                "market_trends": [
                    {
                        "day": <int>,
                        "market_index": <float>,
                        "your_portfolio": <float>
                    }
                ]
            }
        }
        
    Example:
        GET /simulation
        Response: 200 OK
        {
            "success": true,
            "simulation_data": {
                "portfolio_growth": [
                    {"month": "Jan", "value": 10150.0, "invested": 10000},
                    {"month": "Feb", "value": 10305.0, "invested": 10500}
                ],
                "risk_distribution": [
                    {"risk_level": "Low", "percentage": 30, "amount": 3000},
                    {"risk_level": "Medium", "percentage": 50, "amount": 5000},
                    {"risk_level": "High", "percentage": 20, "amount": 2000}
                ],
                "economic_impact": {
                    "jobs_created": 18,
                    "local_revenue_generated": 75000,
                    "businesses_supported": 8,
                    "community_projects_funded": 5
                },
                "market_trends": [
                    {"day": 1, "market_index": 102.5, "your_portfolio": 103.2},
                    {"day": 2, "market_index": 101.8, "your_portfolio": 104.1}
                ]
            }
        }
        
    Notes:
        - All data is simulated for educational purposes
        - Portfolio growth assumes regular monthly investments
        - Economic impact metrics demonstrate local community benefits
        - Market trends compare portfolio performance to broader market indices
    """
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
    """
    Get current user balance
    
    Retrieves the current virtual currency balance for a user account.
    
    Query Parameters:
        user_id (optional): User ID, defaults to 1
    
    Returns:
        200 JSON: User balance information
        404 JSON: User not found
        500 JSON: Server error
        
    Response Schema:
        {
            "success": true,
            "balance": <float>,
            "user": {
                "id": <int>,
                "balance": <float>
            }
        }
        
    Example:
        GET /user/balance?user_id=1
        Response: 200 OK
        {
            "success": true,
            "balance": 9500.0,
            "user": {
                "id": 1,
                "balance": 9500.0
            }
        }
        
    Error Example:
        Response: 404 Not Found
        {
            "success": false,
            "message": "User not found"
        }
    """
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
    """
    Reset user balance to default amount and clear all investments
    
    Resets the user's account to initial state: restores balance to $10,000,
    clears all investments, and resets project funding levels. This is useful
    for educational scenarios where students want to start fresh.
    
    Request Body (optional):
        {
            "user_id": <int> (optional) - User ID, defaults to 1
        }
    
    Returns:
        200 JSON: Successful reset confirmation
        400 JSON: Reset operation failed
        500 JSON: Server error
        
    Response Schema:
        {
            "success": true,
            "balance": 10000.0,
            "message": "Balance and investments successfully reset! Starting fresh with $10,000.",
            "investments_cleared": <int>,
            "projects_reset": <int>
        }
        
    Example:
        POST /user/reset-balance
        Request: {}
        
        Response: 200 OK
        {
            "success": true,
            "balance": 10000.0,
            "message": "Balance and investments successfully reset! Starting fresh with $10,000.",
            "investments_cleared": 3,
            "projects_reset": 2
        }
        
    Operations Performed:
        1. Set user balance to $10,000
        2. Delete all user investments
        3. Reset project funding levels
        4. Clear investment performance history
        
    Note:
        This action is irreversible and will permanently delete all investment data
        for the specified user.
    """
    try:
        user_id = request.json.get('user_id', 1) if request.json else 1
        default_balance = 10000.0
        
        # Reset user balance and clear all investments
        reset_result = db.reset_user_completely(user_id, default_balance)
        
        if not reset_result['success']:
            return jsonify({
                'success': False,
                'message': reset_result['message']
            }), 400
        
        return jsonify({
            'success': True,
            'balance': default_balance,
            'message': 'Balance and investments successfully reset! Starting fresh with $10,000.',
            'investments_cleared': reset_result['investments_cleared'],
            'projects_reset': reset_result['projects_reset']
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error resetting balance: {str(e)}'
        }), 500

@app.route('/user/update-investments', methods=['POST'])
def update_user_investments():
    """
    Update investment values and sync with user balance
    
    Simulates the passage of time and market fluctuations by updating all
    investment values based on risk factors, expected returns, and random
    market volatility. The gains or losses are reflected in the user's balance.
    
    Request Body (optional):
        {
            "user_id": <int> (optional) - User ID, defaults to 1
        }
    
    Returns:
        200 JSON: Investment update results
        400 JSON: Update operation failed
        500 JSON: Server error
        
    Response Schema:
        {
            "success": true,
            "message": <string>,
            "balance_change": <float>,
            "new_balance": <float>,
            "investments_updated": <int>
        }
        
    Example:
        POST /user/update-investments
        Request: {"user_id": 1}
        
        Response: 200 OK
        {
            "success": true,
            "message": "Investment values updated successfully. Portfolio gained $125.50",
            "balance_change": 125.50,
            "new_balance": 9625.50,
            "investments_updated": 3
        }
        
    Update Logic:
        1. Calculate time-based returns using compound growth
        2. Apply risk-based volatility (Low: ±0.2%, Medium: ±0.5%, High: ±1.0%)
        3. Update investment current values
        4. Sync balance changes with user account
        5. Record performance history
        
    Risk Factors:
        - Low Risk: 0.2% daily volatility, stable returns
        - Medium Risk: 0.5% daily volatility, moderate fluctuation
        - High Risk: 1.0% daily volatility, significant swings
        
    Note:
        This endpoint simulates real market conditions for educational purposes.
        Values may increase or decrease based on market simulation.
    """
    try:
        user_id = request.json.get('user_id', 1) if request.json else 1
        
        result = db.update_investment_values(user_id)
        
        if result['success']:
            # Get updated user balance
            user = db.get_user(user_id)
            balance = user['balance'] if user else 0
            
            return jsonify({
                'success': True,
                'message': result['message'],
                'balance_change': result['total_change'],
                'new_balance': balance,
                'investments_updated': result.get('investments_updated', 0)
            })
        else:
            return jsonify({
                'success': False,
                'message': result['message']
            }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating investments: {str(e)}'
        }), 500

@app.route('/user/investment-performance', methods=['GET'])
def get_investment_performance():
    """
    Get investment performance summary
    
    Provides comprehensive performance analytics for a user's investment portfolio,
    including overall returns, individual investment performance, risk metrics,
    and historical performance data.
    
    Query Parameters:
        user_id (optional): User ID, defaults to 1
    
    Returns:
        200 JSON: Investment performance summary
        500 JSON: Server error
        
    Response Schema:
        {
            "success": true,
            "performance": {
                "total_invested": <float>,
                "current_value": <float>,
                "total_return": <float>,
                "total_return_percentage": <float>,
                "best_performing_investment": {
                    "project_name": <string>,
                    "return_percentage": <float>
                },
                "worst_performing_investment": {
                    "project_name": <string>,
                    "return_percentage": <float>
                },
                "risk_distribution": {
                    "Low": <float>,
                    "Medium": <float>,
                    "High": <float>
                },
                "category_performance": {
                    "<category>": {
                        "invested": <float>,
                        "current_value": <float>,
                        "return_percentage": <float>
                    }
                }
            }
        }
        
    Example:
        GET /user/investment-performance?user_id=1
        Response: 200 OK
        {
            "success": true,
            "performance": {
                "total_invested": 1500.0,
                "current_value": 1575.0,
                "total_return": 75.0,
                "total_return_percentage": 5.0,
                "best_performing_investment": {
                    "project_name": "TechStart Solutions",
                    "return_percentage": 15.2
                },
                "worst_performing_investment": {
                    "project_name": "Artisan Bakery",
                    "return_percentage": -2.1
                },
                "risk_distribution": {
                    "Low": 600.0,
                    "Medium": 700.0,
                    "High": 200.0
                },
                "category_performance": {
                    "tech": {"invested": 500.0, "current_value": 520.0, "return_percentage": 4.0},
                    "food": {"invested": 800.0, "current_value": 835.0, "return_percentage": 4.375},
                    "retail": {"invested": 200.0, "current_value": 220.0, "return_percentage": 10.0}
                }
            }
        }
        
    Metrics Included:
        - Portfolio-wide performance statistics
        - Individual investment rankings
        - Risk category analysis
        - Sector/category performance breakdown
        - Historical return tracking
        
    Note:
        Performance data is calculated from simulated market conditions and 
        is intended for educational purposes only.
    """
    try:
        user_id = request.args.get('user_id', 1, type=int)
        
        performance = db.get_investment_performance_summary(user_id)
        
        return jsonify({
            'success': True,
            'performance': performance
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error getting performance: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🎓 Youth Micro-Investing Platform API Server")
    print("=" * 60)
    print("🚀 Starting Flask application...")
    print("📊 Database initialized with 12 simulated projects")
    print("🌐 Server running at: http://localhost:5000")
    print("📱 Frontend served at: http://localhost:5000/")
    print("")
    print("📖 API Documentation:")
    print("   GET  /health                     - Health check and status")
    print("   GET  /projects                   - List all investment projects")
    print("   POST /invest                     - Make an investment")
    print("   GET  /portfolio                  - Get user portfolio with performance")
    print("   GET  /simulation                 - Get charts and visualization data")
    print("   GET  /user/balance              - Get current user balance")
    print("   POST /user/reset-balance        - Reset balance and clear investments")
    print("   POST /user/update-investments   - Update investment values and balance")
    print("   GET  /user/investment-performance - Get performance analytics")
    print("")
    print("🎯 Educational Features:")
    print("   • Simulated local business investments")
    print("   • Risk-based portfolio management")
    print("   • Real-time performance tracking")
    print("   • Financial literacy education")
    print("   • Economic impact visualization")
    print("")
    print("⚡ Ready for connections!")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)