# Testing & Verification Checklist

Use this checklist to verify the application is ready for demo and deployment.

## Pre-Launch Checklist

### Backend Server
- [ ] Server starts without errors: `npm run dev`
- [ ] No missing dependencies
- [ ] All .env variables are set
- [ ] Server listens on port 5000

### Frontend Build
- [ ] Frontend builds without errors: `npm run build`
- [ ] Build output is in `dist/` folder
- [ ] CSS imports are valid (warnings are OK)
- [ ] No TypeScript/JSX errors

### API Endpoints

#### Companies Endpoint
- [ ] GET `/api/companies` returns array of 8 companies
- [ ] Each company has: id, name, industry, location, type, description
- [ ] GET `/api/companies/1` returns Werner Enterprises
- [ ] GET `/api/companies/999` returns 404

#### Analysis Endpoint
- [ ] POST `/api/analyze` with valid company name responds
- [ ] Response includes: profile, painPoints, techStack, outreachAngle
- [ ] POST `/api/analyze` without company name returns 400 error
- [ ] Error handling returns graceful fallback messages

### Frontend Functionality

#### Page Load
- [ ] Page loads without console errors
- [ ] Header displays correctly
- [ ] Company dropdown populated with all 8 companies
- [ ] Dropdown is responsive and styled

#### Company Selection
- [ ] Clicking a company triggers analysis
- [ ] Loading spinner appears while waiting
- [ ] Dropdown is disabled during loading
- [ ] No console errors during analysis

#### Results Display
- [ ] All 4 result cards appear
- [ ] Each card has correct icon and title
- [ ] Cards display content correctly
- [ ] Cards have smooth animations
- [ ] Content is readable and properly formatted

#### Error Handling
- [ ] If API fails, error message displays
- [ ] User can try another company after error
- [ ] Network errors are handled gracefully

### Mobile Responsiveness
- [ ] On mobile width (< 600px):
  - [ ] Header scales down appropriately
  - [ ] Dropdown is full width
  - [ ] Result cards stack vertically
  - [ ] Text is readable (no overflow)
  - [ ] Touch targets are adequate size

### Cross-Browser Testing
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

### CORS & Network
- [ ] Frontend can reach backend API
- [ ] No CORS errors in console
- [ ] Network requests show in DevTools
- [ ] Response times are reasonable (< 5s per analysis)

### Environment Configuration
- [ ] Frontend .env has `VITE_API_URL`
- [ ] Backend .env has all required keys
- [ ] .gitignore prevents .env from being committed
- [ ] Production .env files are documented

### Git & Deployment
- [ ] All changes are committed
- [ ] Commit messages are clear and descriptive
- [ ] No uncommitted files (except node_modules, dist)
- [ ] .gitignore is properly configured
- [ ] Repo is ready to push

## Performance Checks

### Frontend Performance
- [ ] Page loads in < 3 seconds
- [ ] First contentful paint < 1.5 seconds
- [ ] No layout shifts (no janky animations)
- [ ] Animations are smooth (60fps)

### Backend Performance
- [ ] Companies endpoint responds in < 100ms
- [ ] Company/:id endpoint responds in < 100ms
- [ ] Analysis endpoint responds in < 10 seconds (API dependent)
- [ ] No memory leaks (server doesn't grow indefinitely)

### Build Size
- [ ] Frontend bundle < 200KB gzipped
- [ ] CSS is properly minified
- [ ] JavaScript is properly minified
- [ ] No duplicate dependencies

## Deployment Pre-Checks

### Before Pushing to GitHub
- [ ] No sensitive keys in code
- [ ] .env files are in .gitignore
- [ ] No commented-out code
- [ ] README.md is complete
- [ ] DEPLOYMENT.md has clear instructions

### Backend Deployment Ready
- [ ] All environment variables documented
- [ ] PORT is configurable
- [ ] Error messages are informative
- [ ] Logging is adequate for debugging

### Frontend Deployment Ready
- [ ] Build completes without errors
- [ ] API URL is configurable via .env
- [ ] All assets are optimized
- [ ] No hardcoded URLs

## Demo Preparation

### Content Verification
- [ ] Demo script is prepared (DEMO.md)
- [ ] Talking points are clear
- [ ] You've practiced the demo
- [ ] You know answers to likely questions

### Technical Prep
- [ ] Backup internet connection (hotspot)
- [ ] Backup deployment link ready
- [ ] Screenshot of successful analysis saved
- [ ] Local backup of application ready

### Presentation Prep
- [ ] Browser window is clean (no clutter)
- [ ] DevTools are closed
- [ ] Zoom level is readable (100-125%)
- [ ] Screen resolution is comfortable (1920x1080 minimum)

## Troubleshooting Guide

### Issue: Server won't start
**Solution**:
```bash
# Check for port conflicts
lsof -i :5000

# Check dependencies
npm install

# Check .env file exists
cat .env
```

### Issue: Frontend can't reach backend
**Solution**:
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Check CORS headers in backend/server.js
- Check network tab in DevTools

### Issue: Claude API fails
**Solution**:
- Verify API key in backend .env
- Check API account has credits at console.anthropic.com
- Monitor API response in DevTools Network tab

### Issue: Build fails
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build

# Check console for specific errors
```

## Sign-Off

When all items are checked:
- [ ] Application is production-ready
- [ ] Demo has been practiced
- [ ] Deployment plan is clear
- [ ] Team has been briefed (if applicable)

**Status**: Ready for Demo / Ready for Deployment

**Date Verified**: _______________
**Verified By**: _______________
