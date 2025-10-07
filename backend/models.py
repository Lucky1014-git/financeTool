import sqlite3
import json
from datetime import datetime

class Database:
    def __init__(self, db_path='database.db'):
        self.db_path = db_path
        self.init_db()
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_db(self):
        """Initialize database with required tables"""
        conn = self.get_connection()
        
        # Users table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                balance REAL DEFAULT 10000.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Projects table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                expected_roi REAL NOT NULL,
                funding_goal REAL NOT NULL,
                current_funding REAL DEFAULT 0.0,
                location TEXT NOT NULL,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Investments table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS investments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                project_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                current_value REAL NOT NULL,
                investment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (project_id) REFERENCES projects (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Seed initial data
        self.seed_data()
    
    def seed_data(self):
        """Seed database with initial project data"""
        conn = self.get_connection()
        
        # Check if we already have projects
        existing_projects = conn.execute('SELECT COUNT(*) FROM projects').fetchone()[0]
        if existing_projects > 0:
            conn.close()
            return
        
        # Create default user
        conn.execute('''
            INSERT OR IGNORE INTO users (username, balance) 
            VALUES (?, ?)
        ''', ('demo_user', 10000.0))
        
        # Seed mock projects
        projects = [
            {
                'name': 'Green Coffee Shop',
                'description': 'Eco-friendly coffee shop using renewable energy and locally sourced beans. Aims to create a community hub for environmental awareness.',
                'category': 'Food & Beverage',
                'risk_level': 'Medium',
                'expected_roi': 12.5,
                'funding_goal': 25000.0,
                'current_funding': 5000.0,
                'location': 'Downtown District',
                'image_url': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400'
            },
            {
                'name': 'Teen Tech Tutoring',
                'description': 'Peer-to-peer tutoring platform where tech-savvy teens teach coding and digital skills to younger students.',
                'category': 'Education',
                'risk_level': 'Low',
                'expected_roi': 8.0,
                'funding_goal': 15000.0,
                'current_funding': 8000.0,
                'location': 'School District',
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'
            },
            {
                'name': 'Urban Vertical Farm',
                'description': 'Innovative vertical farming startup growing fresh produce in urban areas using hydroponic technology.',
                'category': 'Agriculture',
                'risk_level': 'High',
                'expected_roi': 18.0,
                'funding_goal': 50000.0,
                'current_funding': 12000.0,
                'location': 'Industrial Zone',
                'image_url': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
            },
            {
                'name': 'Mobile Bike Repair',
                'description': 'On-demand bicycle repair service that comes to customers. Promoting sustainable transportation in the city.',
                'category': 'Services',
                'risk_level': 'Medium',
                'expected_roi': 15.0,
                'funding_goal': 8000.0,
                'current_funding': 3000.0,
                'location': 'City Wide',
                'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
            },
            {
                'name': 'Artisan Marketplace',
                'description': 'Online platform connecting local artists and craftspeople with customers. Supporting creative entrepreneurship.',
                'category': 'E-commerce',
                'risk_level': 'Medium',
                'expected_roi': 14.0,
                'funding_goal': 20000.0,
                'current_funding': 6000.0,
                'location': 'Online Platform',
                'image_url': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'
            },
            {
                'name': 'Solar Panel Installation',
                'description': 'Residential solar panel installation service focused on making renewable energy accessible to homeowners.',
                'category': 'Energy',
                'risk_level': 'Low',
                'expected_roi': 10.0,
                'funding_goal': 35000.0,
                'current_funding': 15000.0,
                'location': 'Suburban Areas',
                'image_url': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400'
            },
            {
                'name': 'Youth Gaming Lounge',
                'description': 'Modern gaming center offering esports tournaments and gaming workshops for young people in a safe environment.',
                'category': 'Entertainment',
                'risk_level': 'Medium',
                'expected_roi': 16.0,
                'funding_goal': 30000.0,
                'current_funding': 7500.0,
                'location': 'Entertainment District',
                'image_url': 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400'
            },
            {
                'name': 'Community Pet Grooming',
                'description': 'Mobile pet grooming service bringing professional care directly to pet owners homes with eco-friendly products.',
                'category': 'Services',
                'risk_level': 'Low',
                'expected_roi': 9.5,
                'funding_goal': 12000.0,
                'current_funding': 4000.0,
                'location': 'Residential Areas',
                'image_url': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
            },
            {
                'name': 'Sustainable Fashion Boutique',
                'description': 'Clothing store specializing in ethically-made, sustainable fashion from local designers and eco-friendly brands.',
                'category': 'Retail',
                'risk_level': 'Medium',
                'expected_roi': 13.5,
                'funding_goal': 22000.0,
                'current_funding': 9000.0,
                'location': 'Shopping District',
                'image_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
            },
            {
                'name': 'Drone Photography Service',
                'description': 'Professional aerial photography and videography service for real estate, events, and commercial projects.',
                'category': 'Technology',
                'risk_level': 'High',
                'expected_roi': 22.0,
                'funding_goal': 18000.0,
                'current_funding': 5500.0,
                'location': 'Metropolitan Area',
                'image_url': 'https://images.unsplash.com/photo-1508444845599-47a5d85cca12?w=400'
            },
            {
                'name': 'Healthy Meal Prep Kitchen',
                'description': 'Subscription-based meal preparation service delivering nutritious, locally-sourced meals to busy families.',
                'category': 'Food & Beverage',
                'risk_level': 'Medium',
                'expected_roi': 11.0,
                'funding_goal': 28000.0,
                'current_funding': 11000.0,
                'location': 'Central Kitchen',
                'image_url': 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400'
            },
            {
                'name': 'Indoor Rock Climbing Gym',
                'description': 'Community fitness center featuring rock climbing walls, yoga classes, and outdoor adventure programs for all ages.',
                'category': 'Fitness',
                'risk_level': 'High',
                'expected_roi': 19.5,
                'funding_goal': 45000.0,
                'current_funding': 13500.0,
                'location': 'Recreation Complex',
                'image_url': 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400'
            }
        ]
        
        for project in projects:
            conn.execute('''
                INSERT INTO projects 
                (name, description, category, risk_level, expected_roi, funding_goal, current_funding, location, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                project['name'], project['description'], project['category'],
                project['risk_level'], project['expected_roi'], project['funding_goal'],
                project['current_funding'], project['location'], project['image_url']
            ))
        
        conn.commit()
        conn.close()
    
    def get_projects(self):
        """Get all available projects"""
        conn = self.get_connection()
        projects = conn.execute('''
            SELECT * FROM projects ORDER BY created_at DESC
        ''').fetchall()
        conn.close()
        return [dict(project) for project in projects]
    
    def get_user(self, user_id=1):
        """Get user information"""
        conn = self.get_connection()
        user = conn.execute('''
            SELECT * FROM users WHERE id = ?
        ''', (user_id,)).fetchone()
        conn.close()
        return dict(user) if user else None
    
    def make_investment(self, user_id, project_id, amount):
        """Make an investment in a project"""
        conn = self.get_connection()
        
        try:
            # Check if user has sufficient balance
            user = conn.execute('SELECT balance FROM users WHERE id = ?', (user_id,)).fetchone()
            if not user or user['balance'] < amount:
                return {'success': False, 'message': 'Insufficient balance'}
            
            # Check if project exists
            project = conn.execute('SELECT * FROM projects WHERE id = ?', (project_id,)).fetchone()
            if not project:
                return {'success': False, 'message': 'Project not found'}
            
            # Update user balance
            new_balance = user['balance'] - amount
            conn.execute('UPDATE users SET balance = ? WHERE id = ?', (new_balance, user_id))
            
            # Update project funding
            new_funding = project['current_funding'] + amount
            conn.execute('UPDATE projects SET current_funding = ? WHERE id = ?', (new_funding, project_id))
            
            # Create investment record
            conn.execute('''
                INSERT INTO investments (user_id, project_id, amount, current_value)
                VALUES (?, ?, ?, ?)
            ''', (user_id, project_id, amount, amount))
            
            conn.commit()
            return {'success': True, 'message': 'Investment successful'}
            
        except Exception as e:
            conn.rollback()
            return {'success': False, 'message': str(e)}
        finally:
            conn.close()
    
    def get_portfolio(self, user_id=1):
        """Get user's investment portfolio"""
        conn = self.get_connection()
        
        # Get user info
        user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        
        # Get investments with project details
        investments = conn.execute('''
            SELECT i.*, p.name as project_name, p.risk_level, p.expected_roi, p.category
            FROM investments i
            JOIN projects p ON i.project_id = p.id
            WHERE i.user_id = ?
            ORDER BY i.investment_date DESC
        ''', (user_id,)).fetchall()
        
        conn.close()
        
        portfolio = {
            'user': dict(user) if user else None,
            'investments': [dict(inv) for inv in investments],
            'total_invested': sum(inv['amount'] for inv in investments),
            'current_value': sum(inv['current_value'] for inv in investments)
        }
        
        return portfolio
    
    def update_user_balance(self, user_id, new_balance):
        """Update user balance"""
        try:
            conn = self.get_connection()
            conn.execute('''
                UPDATE users SET balance = ? WHERE id = ?
            ''', (new_balance, user_id))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            return False
    
    def reset_user_completely(self, user_id, default_balance):
        """Reset user balance and clear all investments, also reset project funding"""
        try:
            conn = self.get_connection()
            
            # Get user's current investments to calculate funding to subtract from projects
            user_investments = conn.execute('''
                SELECT project_id, SUM(amount) as total_investment
                FROM investments 
                WHERE user_id = ?
                GROUP BY project_id
            ''', (user_id,)).fetchall()
            
            # Count investments being cleared
            investment_count = conn.execute('''
                SELECT COUNT(*) FROM investments WHERE user_id = ?
            ''', (user_id,)).fetchone()[0]
            
            # Reset project funding by subtracting user's investments
            projects_reset = 0
            for investment in user_investments:
                project_id = investment['project_id']
                amount_to_subtract = investment['total_investment']
                
                # Get current project funding
                current_funding = conn.execute('''
                    SELECT current_funding FROM projects WHERE id = ?
                ''', (project_id,)).fetchone()
                
                if current_funding:
                    new_funding = max(0, current_funding['current_funding'] - amount_to_subtract)
                    conn.execute('''
                        UPDATE projects SET current_funding = ? WHERE id = ?
                    ''', (new_funding, project_id))
                    projects_reset += 1
            
            # Clear all user investments
            conn.execute('''
                DELETE FROM investments WHERE user_id = ?
            ''', (user_id,))
            
            # Reset user balance
            conn.execute('''
                UPDATE users SET balance = ? WHERE id = ?
            ''', (default_balance, user_id))
            
            conn.commit()
            conn.close()
            
            return {
                'success': True,
                'investments_cleared': investment_count,
                'projects_reset': projects_reset,
                'message': f'Reset complete: {investment_count} investments cleared, {projects_reset} projects updated'
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error during complete reset: {str(e)}'
            }
    
    def update_investment_values(self, user_id=1):
        """Update investment values based on project performance and sync with user balance"""
        import random
        import math
        from datetime import datetime, timedelta
        
        try:
            conn = self.get_connection()
            
            # Get all user investments with project details
            investments = conn.execute('''
                SELECT i.id, i.user_id, i.project_id, i.amount, i.current_value, 
                       i.investment_date, p.expected_roi, p.risk_level, p.name
                FROM investments i
                JOIN projects p ON i.project_id = p.id
                WHERE i.user_id = ?
            ''', (user_id,)).fetchall()
            
            if not investments:
                return {'success': True, 'message': 'No investments to update', 'total_change': 0}
            
            total_balance_change = 0
            updated_investments = 0
            
            for investment in investments:
                # Calculate time since investment (simulate market performance over time)
                investment_date = datetime.fromisoformat(investment['investment_date'])
                days_invested = (datetime.now() - investment_date).days
                
                if days_invested < 1:
                    continue  # Don't update same-day investments
                
                # Calculate performance based on expected ROI and risk level
                expected_roi = investment['expected_roi'] / 100  # Convert percentage to decimal
                risk_multiplier = self._get_risk_multiplier(investment['risk_level'])
                
                # Add some randomness based on risk level
                random_factor = random.uniform(-risk_multiplier, risk_multiplier)
                daily_performance = (expected_roi / 365) + (random_factor / 365)
                
                # Calculate new value with compound growth
                original_amount = investment['amount']
                new_value = original_amount * (1 + daily_performance) ** days_invested
                
                # Ensure minimum value (can't lose more than 90% for safety)
                new_value = max(new_value, original_amount * 0.1)
                
                # Calculate the change in value
                old_value = investment['current_value']
                value_change = new_value - old_value
                
                # Update investment value
                conn.execute('''
                    UPDATE investments SET current_value = ? WHERE id = ?
                ''', (new_value, investment['id']))
                
                total_balance_change += value_change
                updated_investments += 1
            
            # Update user balance with the total change
            if total_balance_change != 0:
                current_balance = conn.execute('''
                    SELECT balance FROM users WHERE id = ?
                ''', (user_id,)).fetchone()['balance']
                
                new_balance = current_balance + total_balance_change
                conn.execute('''
                    UPDATE users SET balance = ? WHERE id = ?
                ''', (new_balance, user_id))
            
            conn.commit()
            conn.close()
            
            return {
                'success': True,
                'message': f'Updated {updated_investments} investments',
                'total_change': total_balance_change,
                'investments_updated': updated_investments
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error updating investments: {str(e)}'
            }
    
    def _get_risk_multiplier(self, risk_level):
        """Get risk multiplier based on risk level"""
        risk_multipliers = {
            'Low': 0.02,      # 2% volatility
            'Medium': 0.05,   # 5% volatility  
            'High': 0.10      # 10% volatility
        }
        return risk_multipliers.get(risk_level, 0.05)
    
    def get_investment_performance_summary(self, user_id=1):
        """Get summary of investment performance"""
        try:
            conn = self.get_connection()
            
            investments = conn.execute('''
                SELECT SUM(amount) as total_invested, SUM(current_value) as total_value
                FROM investments WHERE user_id = ?
            ''', (user_id,)).fetchone()
            
            conn.close()
            
            if not investments or not investments['total_invested']:
                return {
                    'total_invested': 0,
                    'total_value': 0,
                    'total_gain_loss': 0,
                    'performance_percentage': 0
                }
            
            total_invested = investments['total_invested']
            total_value = investments['total_value']
            total_gain_loss = total_value - total_invested
            performance_percentage = (total_gain_loss / total_invested) * 100 if total_invested > 0 else 0
            
            return {
                'total_invested': total_invested,
                'total_value': total_value,
                'total_gain_loss': total_gain_loss,
                'performance_percentage': performance_percentage
            }
            
        except Exception as e:
            return {
                'total_invested': 0,
                'total_value': 0,
                'total_gain_loss': 0,
                'performance_percentage': 0
            }