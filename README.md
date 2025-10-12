# Youth Micro-Investing Platform Simulator

A full-stack web application that teaches teens about saving, investing, and entrepreneurship through simulated investments in local projects and businesses.

## Project Structure

```
financeTool/
├── backend/           # Flask API server
│   ├── app.py        # Main Flask application
│   ├── models.py     # Database models
│   ├── database.db   # SQLite database
│   └── requirements.txt
├── frontend/         # React client application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Features

- **Virtual Capital Allocation**: Allocate virtual money to local initiatives and startup ideas
- **Risk & Return Simulation**: Visualize potential returns and risks
- **Portfolio Management**: Track investments, balance, and simulated returns
- **Economic Impact Visualization**: See how investments stimulate economic activity
- **Youth-Friendly UI**: Colorful, engaging interface designed for teens

## Tech Stack

- **Frontend**: React + TailwindCSS + Recharts
- **Backend**: Flask + SQLite
- **API**: RESTful endpoints with JSON responses

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /projects` - Returns list of available investment projects
- `POST /invest` - Invest virtual capital into a project
- `GET /portfolio` - Returns user's current investments and returns

## Development

[![Athena Award Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Faward.athena.hackclub.com%2Fapi%2Fbadge)](https://award.athena.hackclub.com?utm_source=readme)

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- CORS enabled for local development
