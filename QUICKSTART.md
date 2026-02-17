# Quick Start Guide

Get the Logistics Prospect Intelligence Tool running in 5 minutes.

## 1. Prerequisites

- **Node.js** 16+ ([download](https://nodejs.org/))
- **API Keys** (get these first):
  - Claude API: https://console.anthropic.com (required)
  - NewsAPI: https://newsapi.org (optional but recommended)
  - Serper: https://serper.dev (optional)

## 2. Clone the Repo

```bash
cd logistics-prospect-tool
```

*Or if cloning for the first time:*
```bash
git clone <repo-url>
cd logistics-prospect-tool
```

## 3. Setup Backend

```bash
cd backend

# Copy example env file
cp .env.example .env

# Edit .env and add your API keys
# CLAUDE_API_KEY=your_key_here
# NEWSAPI_KEY=your_key_here
# SERPER_API_KEY=your_key_here
```

**On Mac/Linux** (edit in terminal):
```bash
nano .env
# or
vim .env
```

**On Windows** (edit with notepad):
```bash
notepad .env
```

Then:
```bash
# Install dependencies
npm install

# Start server
npm run dev
```

You should see: `Server running on port 5000`

## 4. Setup Frontend (New Terminal)

```bash
cd frontend

# Copy example env file
cp .env.example .env

# Install dependencies
npm install

# Start frontend
npm run dev
```

You should see: `Local: http://localhost:3000`

## 5. Open in Browser

Go to: **http://localhost:3000**

You should see:
- Title: "Prospect Intelligence"
- Dropdown with company names
- Clean dark-themed interface

## 6. Test It

1. Click the dropdown
2. Select a company (e.g., "Werner Enterprises")
3. Watch the loading spinner
4. See the AI-generated analysis (or fallback if no Claude credits)

## Done! 🎉

The app is running locally. You can now:
- Select different companies
- Check the browser console (F12) for any issues
- View server logs in the backend terminal
- Modify code and see changes in real-time

## Stopping the Servers

Press `Ctrl+C` in each terminal to stop the servers.

## Next Steps

- **Read** [README.md](./README.md) for full documentation
- **Deploy** using [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Demo** using [DEMO.md](./DEMO.md)
- **Test** using [TESTING.md](./TESTING.md)

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 5000 or 3000
lsof -i :5000
lsof -i :3000

# Kill the process (macOS/Linux)
kill -9 <PID>
```

### Dependencies Won't Install
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### API Keys Not Working
1. Check they're in the `.env` file (not in `.env.example`)
2. Verify there are no extra spaces or quotes
3. Make sure backend is restarted after changing `.env`

### "Cannot find module" Error
```bash
# Make sure you're in the right directory
pwd

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Blank Page in Browser
1. Check browser console (F12) for errors
2. Make sure both servers are running
3. Check that `VITE_API_URL` in frontend/.env matches your backend URL

---

**Having trouble?** Check:
- [TESTING.md](./TESTING.md) - Full testing checklist
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment help
- Server logs in terminal
- Browser console (F12 → Console tab)
