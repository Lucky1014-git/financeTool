# Youth Micro-Investing Platform API Documentation

## Overview

The Youth Micro-Investing Platform API is a Flask-based REST API designed for educational purposes, allowing teenagers to learn about investing through simulated micro-investments in local businesses.

### Base Information
- **Base URL**: `http://localhost:5000`
- **Content-Type**: `application/json`
- **Authentication**: None (educational platform)
- **Version**: 1.0.0

## API Endpoints

### 🏥 Health Check

#### `GET /health`
Health check endpoint for monitoring and deployment status.

**Response:**
```json
{
    "status": "healthy",
    "message": "Youth Micro-Investing Platform API",
    "version": "1.0.0"
}
```

---

### 🏢 Projects Management

#### `GET /projects`
Retrieve all available investment projects (simulated local businesses).

**Query Parameters:**
- `category` (optional): Filter by business category
- `min_funding` (optional): Minimum funding percentage
- `max_funding` (optional): Maximum funding percentage

**Response:**
```json
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
```

**Available Categories:**
- `food` - Restaurants, cafes, bakeries
- `tech` - Technology startups, app development
- `retail` - Clothing stores, boutiques
- `service` - Personal services, consulting
- `fitness` - Gyms, wellness centers
- `creative` - Art studios, design agencies

**Risk Levels:**
- `Low` - Stable businesses with predictable returns
- `Medium` - Growing businesses with moderate volatility
- `High` - Startups with high growth potential but higher risk

---

### 💰 Investment Operations

#### `POST /invest`
Make an investment in a selected project.

**Request Body:**
```json
{
    "project_id": 1,
    "amount": 500.0,
    "user_id": 1
}
```

**Required Fields:**
- `project_id` (integer): ID of the project to invest in
- `amount` (float): Investment amount in USD

**Optional Fields:**
- `user_id` (integer): User ID, defaults to 1

**Validation Rules:**
- Amount must be positive
- User must have sufficient balance
- Amount must meet minimum investment requirement
- Project must exist and be available

**Success Response:**
```json
{
    "success": true,
    "message": "Investment successful!",
    "investment": {
        "project_id": 1,
        "amount": 500.0,
        "timestamp": 1640995200.0
    }
}
```

**Error Responses:**
```json
{
    "success": false,
    "message": "Insufficient funds"
}
```

---

### 📊 Portfolio Management

#### `GET /portfolio`
Retrieve user's complete investment portfolio with performance metrics.

**Query Parameters:**
- `user_id` (optional): User ID, defaults to 1

**Response:**
```json
{
    "success": true,
    "portfolio": {
        "user": {
            "id": 1,
            "balance": 9500.0
        },
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
        "diversification": {
            "food": 500.0
        }
    }
}
```

**Performance Calculations:**
- Current values simulate market fluctuations
- Returns calculated based on time elapsed and risk factors
- Diversification shows investment distribution across categories

---

### 📈 Simulation Data

#### `GET /simulation`
Get mock data for charts and visualizations in the frontend.

**Response:**
```json
{
    "success": true,
    "simulation_data": {
        "portfolio_growth": [
            {
                "month": "Jan",
                "value": 10150.0,
                "invested": 10000
            }
        ],
        "risk_distribution": [
            {
                "risk_level": "Low",
                "percentage": 30,
                "amount": 3000
            }
        ],
        "economic_impact": {
            "jobs_created": 18,
            "local_revenue_generated": 75000,
            "businesses_supported": 8,
            "community_projects_funded": 5
        },
        "market_trends": [
            {
                "day": 1,
                "market_index": 102.5,
                "your_portfolio": 103.2
            }
        ]
    }
}
```

**Data Types:**
- `portfolio_growth`: Historical portfolio value over time
- `risk_distribution`: Investment allocation by risk level
- `economic_impact`: Simulated community benefits
- `market_trends`: Portfolio vs. market comparison

---

### 👤 User Management

#### `GET /user/balance`
Get current user balance.

**Query Parameters:**
- `user_id` (optional): User ID, defaults to 1

**Response:**
```json
{
    "success": true,
    "balance": 9500.0,
    "user": {
        "id": 1,
        "balance": 9500.0
    }
}
```

#### `POST /user/reset-balance`
Reset user balance to $10,000 and clear all investments.

**Request Body (optional):**
```json
{
    "user_id": 1
}
```

**Response:**
```json
{
    "success": true,
    "balance": 10000.0,
    "message": "Balance and investments successfully reset! Starting fresh with $10,000.",
    "investments_cleared": 3,
    "projects_reset": 2
}
```

**⚠️ Warning:** This action is irreversible and will permanently delete all investment data.

#### `POST /user/update-investments`
Update investment values based on market simulation.

**Request Body (optional):**
```json
{
    "user_id": 1
}
```

**Response:**
```json
{
    "success": true,
    "message": "Investment values updated successfully. Portfolio gained $125.50",
    "balance_change": 125.50,
    "new_balance": 9625.50,
    "investments_updated": 3
}
```

**Update Logic:**
- Applies compound growth based on expected ROI
- Adds risk-based volatility:
  - Low Risk: ±0.2% daily volatility
  - Medium Risk: ±0.5% daily volatility
  - High Risk: ±1.0% daily volatility
- Updates user balance with gains/losses

#### `GET /user/investment-performance`
Get comprehensive investment performance analytics.

**Query Parameters:**
- `user_id` (optional): User ID, defaults to 1

**Response:**
```json
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
            "tech": {
                "invested": 500.0,
                "current_value": 520.0,
                "return_percentage": 4.0
            }
        }
    }
}
```

---

## Error Handling

### HTTP Status Codes
- `200 OK` - Successful request
- `400 Bad Request` - Validation errors, insufficient funds
- `404 Not Found` - User or resource not found
- `500 Internal Server Error` - Server-side errors

### Error Response Format
```json
{
    "success": false,
    "message": "Error description"
}
```

---

## Educational Features

### Investment Simulation
- **Time-based Returns**: Investments grow/decline over simulated time
- **Risk Factors**: Different volatility levels affect returns
- **Market Conditions**: Random fluctuations simulate real markets
- **Compound Growth**: Returns are calculated using compound interest

### Learning Objectives
1. **Portfolio Diversification**: Spread investments across categories
2. **Risk Management**: Understand risk vs. return trade-offs
3. **Performance Tracking**: Monitor investment success over time
4. **Economic Impact**: Learn how investments affect communities

### Safety Features
- All transactions use virtual currency
- No real money involved
- Reset functionality for starting over
- Educational disclaimers throughout

---

## Deployment Information

### Requirements
- Python 3.7+
- Flask 2.0+
- Flask-CORS
- SQLite3
- Gunicorn (for production)

### Environment Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
python app.py

# Production deployment (using Gunicorn)
gunicorn app:app
```

### Configuration Files
- `Procfile`: Deployment configuration for platforms like Heroku
- `requirements.txt`: Python dependencies
- Database is automatically initialized on first run

---

## Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `balance` (REAL DEFAULT 10000.0)

### Projects Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `funding_goal` (REAL)
- `current_funding` (REAL DEFAULT 0)
- `expected_roi` (REAL)
- `risk_level` (TEXT)
- `min_investment` (REAL DEFAULT 50.0)

### Investments Table
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER)
- `project_id` (INTEGER)
- `amount` (REAL)
- `current_value` (REAL)
- `investment_date` (TEXT)

---

## Support and Contact

This is an educational platform designed for learning purposes. For questions about implementation or educational use, please refer to the documentation or contact the development team.

**Last Updated**: January 2024
**API Version**: 1.0.0