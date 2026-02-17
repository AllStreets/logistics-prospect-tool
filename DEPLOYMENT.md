# Deployment Guide

This guide covers deploying the Logistics Prospect Tool to production.

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- Deployed backend URL

### Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - After deployment, go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add: `VITE_API_URL=https://your-deployed-backend.com`

4. **Redeploy**
   - Trigger a new deployment to apply env variables

### Automatic Deployments
- Connect your GitHub repo to Vercel for automatic deployments on push

## Backend Deployment (Railway or Render)

### Option A: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   cd backend
   railway up
   ```

3. **Set Environment Variables**
   - Go to Railway Dashboard > Your Project > Variables
   - Add:
     - `CLAUDE_API_KEY`: Your Claude API key
     - `NEWSAPI_KEY`: Your NewsAPI key
     - `SERPER_API_KEY`: Your Serper API key
     - `PORT`: 5000

### Option B: Render

1. **Prepare Repository**
   - Ensure backend code is in GitHub

2. **Create Web Service on Render**
   - Go to render.com
   - Click "New +" > "Web Service"
   - Connect your GitHub repo
   - Set Root Directory: `backend`
   - Set Build Command: `npm install`
   - Set Start Command: `node server.js`

3. **Add Environment Variables**
   - In Render Dashboard > Environment:
     - `CLAUDE_API_KEY`: Your Claude API key
     - `NEWSAPI_KEY`: Your NewsAPI key
     - `SERPER_API_KEY`: Your Serper API key
     - `PORT`: 5000

4. **Deploy**
   - Click "Create Web Service"

## Testing After Deployment

1. Visit your Vercel frontend URL
2. Verify the dropdown loads companies
3. Select a company and test analysis
4. Check browser console for any errors

## Monitoring

- **Vercel**: Deployments tab shows build/deploy status
- **Railway/Render**: Dashboard shows logs and deployment status

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured (already in code)
- Check frontend env var `VITE_API_URL` is set correctly

### Claude API Errors
- Verify API key has credits at console.anthropic.com
- Check API key is set correctly in backend environment variables

### Companies Not Loading
- Verify backend `/api/companies` endpoint is accessible
- Check network tab in browser DevTools
