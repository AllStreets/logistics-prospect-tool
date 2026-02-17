# Logistics Prospect Intelligence Tool

An AI-powered web application that analyzes logistics and trucking companies to generate sales intelligence for HappyRobot SDR outreach.

## Features

- **Company Database**: Curated list of 8 major trucking companies
- **AI Analysis**: Claude-powered synthesis generating company profiles, pain points, and outreach angles
- **News Aggregation**: Pulls recent news and search data about companies
- **Modern UI**: Sleek dark-themed interface with real-time analysis
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **AI**: Claude API 3.5 Sonnet
- **Data Sources**: NewsAPI, Serper API

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- API Keys:
  - Claude API key (required)
  - NewsAPI key (optional)
  - Serper API key (optional)

### Local Development

1. **Clone and setup**
   ```bash
   cd logistics-prospect-tool
   ```

2. **Configure backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   npm install
   npm run dev
   ```

3. **Configure frontend** (in new terminal)
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:3000`
   - Select a company from dropdown
   - View AI-generated analysis

## Project Structure

```
logistics-prospect-tool/
├── backend/
│   ├── server.js                 # Express server and routes
│   ├── data/
│   │   └── companies.json        # Curated company database
│   ├── services/
│   │   ├── dataAggregator.js    # NewsAPI + Serper integration
│   │   └── claudeSynthesizer.js # Claude API analysis
│   ├── package.json
│   ├── .env.example
│   └── .env                      # (not committed)
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # App styles
│   │   ├── components/
│   │   │   ├── SearchBar.jsx    # Company selector
│   │   │   ├── SearchBar.css
│   │   │   ├── ResultCard.jsx   # Analysis result display
│   │   │   └── ResultCard.css
│   │   └── index.css            # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env                      # (not committed)
├── DEPLOYMENT.md                 # Deployment guide
└── README.md                      # This file
```

## API Endpoints

### Backend (http://localhost:5000)

#### Get all companies
```
GET /api/companies
```

Response: Array of company objects

#### Get single company
```
GET /api/companies/:id
```

Response: Company object

#### Analyze company
```
POST /api/analyze
Content-Type: application/json

{
  "companyName": "Werner Enterprises"
}
```

Response: Analysis with profile, painPoints, techStack, outreachAngle

## Environment Variables

### Backend (.env)
```
CLAUDE_API_KEY=your_key
NEWSAPI_KEY=your_key (optional)
SERPER_API_KEY=your_key (optional)
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Development

### Adding a Company
1. Edit `backend/data/companies.json`
2. Add new object to array with required fields
3. Restart backend server

### Modifying Analysis
1. Edit prompts in `backend/services/claudeSynthesizer.js`
2. Adjust system/user prompts as needed

### Styling Changes
- Global styles: `frontend/src/index.css`
- App styles: `frontend/src/App.css`
- Component styles: `frontend/src/components/[Component].css`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel (frontend) and Railway/Render (backend).

## Error Handling

- **Claude API unavailable**: Falls back to generic messages
- **NewsAPI/Serper failures**: Gracefully degrades, shows what's available
- **Company not found**: Returns 404
- **Missing required fields**: Returns 400

## Known Issues

- CSS import order warning during build (non-blocking)
- NewsAPI/Serper require valid API keys to fetch real data
- Claude API requires account with sufficient credits

## Future Improvements

- Add more companies to database
- Implement caching for faster responses
- Add export functionality (PDF/CSV)
- User authentication for saved analyses
- Admin panel to manage companies
