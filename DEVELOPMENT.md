# Development Guide

## Prerequisites

### Windows Requirements
- **Python 3.8+**: Download from [python.org](https://python.org)
- **Node.js 14+**: Download from [nodejs.org](https://nodejs.org)
- **Git**: Download from [git-scm.com](https://git-scm.com)

### Quick Setup (Recommended)

1. **Install Dependencies**
   ```bash
   # Run the automated installer
   install-deps.bat
   ```

2. **Start Development Servers**
   ```bash
   # Start both backend and frontend
   start-dev.bat
   ```

### Manual Setup

#### Backend Setup
```bash
cd backend
pip install flask flask-cors
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Development Workflow

### Starting Development
1. Open terminal in project root
2. Run `start-dev.bat` (Windows) or use manual commands
3. Backend will be available at `http://localhost:5000`
4. Frontend will be available at `http://localhost:3000`

### Project Structure
```
financeTool/
├── backend/
│   ├── app.py              # Flask application
│   ├── models.py           # Database models
│   ├── requirements.txt    # Python dependencies
│   └── database.db        # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API and cache services
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS config
├── start-dev.bat          # Development startup script
├── install-deps.bat       # Dependency installer
└── README.md
```

### API Endpoints

- `GET /projects` - List all investment projects
- `POST /invest` - Make an investment
- `GET /portfolio` - Get user portfolio
- `GET /simulation` - Get simulation data
- `GET /user/balance` - Get user balance

### Database Schema

#### Users Table
- `id` (Primary Key)
- `username`
- `balance` (Default: 10000.0)
- `created_at`

#### Projects Table
- `id` (Primary Key)
- `name`
- `description`
- `category`
- `risk_level` (Low/Medium/High)
- `expected_roi`
- `funding_goal`
- `current_funding`
- `location`
- `image_url`

#### Investments Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `project_id` (Foreign Key)
- `amount`
- `current_value`
- `investment_date`

## Features

### Implemented Features
✅ Virtual capital allocation  
✅ Project browsing with filtering  
✅ Investment simulation  
✅ Portfolio tracking  
✅ Risk analysis  
✅ Economic impact visualization  
✅ Responsive design  
✅ Local storage caching  

### Technology Stack
- **Backend**: Flask + SQLite
- **Frontend**: React + TailwindCSS
- **Charts**: Recharts
- **State Management**: React Hooks + Local Storage
- **Styling**: TailwindCSS with custom components

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend (5000): Check if another Flask app is running
   - Frontend (3000): Check if another React app is running

2. **Module not found errors**
   - Backend: Run `pip install -r requirements.txt`
   - Frontend: Run `npm install`

3. **Database errors**
   - Delete `backend/database.db` to reset the database
   - Restart the backend server

4. **CORS errors**
   - Ensure backend is running on port 5000
   - Check Flask-CORS is installed

### Performance Tips
- Local storage caching improves load times
- Use the filter and sort features on the Projects page
- Charts are responsive and optimized for mobile

## Contributing

1. Follow the existing code structure
2. Add comments for complex logic
3. Test both desktop and mobile layouts
4. Ensure API endpoints return proper error messages

## Deployment Notes

### Production Considerations
- Use a production WSGI server (not Flask dev server)
- Use a production database (PostgreSQL/MySQL)
- Enable HTTPS
- Configure proper CORS origins
- Add authentication and authorization
- Implement rate limiting
- Add comprehensive error handling