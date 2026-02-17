# Design: Analysis History, Favorites, Compare & Batch Email Generation

**Date**: 2026-02-17
**Feature**: Add persistent analysis storage, favorites, side-by-side company comparison, and cost-optimized batch email generation
**Goal**: Enhance SDR workflow to save, compare, and generate personalized outreach for multiple prospects in one session

---

## Overview

This feature set transforms the Prospect Intelligence tool from a single-query analysis tool into a full SDR workflow platform:

1. **Analysis History**: Save company analyses to SQLite database for future reference
2. **Favorites System**: Mark analyses as favorites for quick access
3. **Compare View**: View 2-3 saved companies side-by-side to identify best fit prospects
4. **Batch Email Generation**: Generate personalized cold outreach emails for multiple companies in ONE API call (cost-optimized)

The result is an impressive portfolio piece showing database design, cost optimization, and UX flow thinking—exactly what hiring managers want to see.

---

## Architecture & Database

### SQLite Database Schema

```
TABLE: saved_analyses
├── id INTEGER PRIMARY KEY AUTOINCREMENT
├── company_name TEXT NOT NULL
├── analysis_data TEXT NOT NULL (JSON stringified)
├── timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
├── is_favorite BOOLEAN DEFAULT 0
└── UNIQUE(company_name, timestamp) -- allow re-analysis of same company
```

**Why SQLite**:
- Zero cost, zero infrastructure
- File-based (lives in `backend/analyses.db`)
- Perfect for MVP/demo projects
- Shows database fundamentals without DevOps overhead

**Analysis data structure** (stored as JSON):
```json
{
  "profile": "2-3 sentence overview",
  "painPoints": ["Point 1", "Point 2", "Point 3"],
  "techStack": "1-2 sentence assessment",
  "outreachAngle": "Specific cold call pitch",
  "timestamp": "ISO timestamp when generated"
}
```

Storing the entire analysis as JSON means we can compare and regenerate emails without re-querying the AI—major cost savings.

---

## Backend API Endpoints

### 1. POST `/api/save-analysis`
Save a company analysis to the database.

**Request**:
```json
{
  "companyName": "Werner Enterprises",
  "analysisData": {
    "profile": "...",
    "painPoints": ["..."],
    "techStack": "...",
    "outreachAngle": "..."
  }
}
```

**Response**:
```json
{
  "id": 1,
  "companyName": "Werner Enterprises",
  "timestamp": "2026-02-17T10:30:00Z",
  "message": "Analysis saved successfully"
}
```

---

### 2. GET `/api/saved-analyses`
Retrieve all saved analyses with basic metadata (for favorites list).

**Response**:
```json
[
  {
    "id": 1,
    "companyName": "Werner Enterprises",
    "timestamp": "2026-02-17T10:30:00Z",
    "is_favorite": true,
    "profile": "..." (preview only)
  },
  ...
]
```

---

### 3. GET `/api/saved-analyses/:id`
Retrieve full analysis data for a specific saved company (for compare/email views).

**Response**:
```json
{
  "id": 1,
  "companyName": "Werner Enterprises",
  "analysisData": {
    "profile": "...",
    "painPoints": ["..."],
    "techStack": "...",
    "outreachAngle": "..."
  },
  "timestamp": "2026-02-17T10:30:00Z",
  "is_favorite": true
}
```

---

### 4. PUT `/api/saved-analyses/:id/favorite`
Toggle a saved analysis as favorite.

**Request**:
```json
{ "is_favorite": true }
```

**Response**: Updated analysis object

---

### 5. DELETE `/api/saved-analyses/:id`
Delete a saved analysis.

**Response**:
```json
{ "message": "Analysis deleted", "id": 1 }
```

---

### 6. POST `/api/generate-emails`
Generate personalized emails for multiple saved companies in ONE API call (cost-optimized batch generation).

**Request**:
```json
{
  "companyIds": [1, 2, 3],
  "emailTone": "professional" // optional: "friendly", "formal", "casual"
}
```

**Response**:
```json
{
  "emails": [
    {
      "companyId": 1,
      "companyName": "Werner Enterprises",
      "email": "Hi [Name],\n\nWe help logistics teams like Werner reduce driver communication friction..."
    },
    {
      "companyId": 2,
      "companyName": "Heartland Express",
      "email": "Hi [Name],\n\nHeartland's owner-operator network faces unique dispatch coordination challenges..."
    },
    ...
  ]
}
```

**Backend implementation note**: Retrieves full analysis data for all requested companies from SQLite, then sends **single batch prompt** to OpenAI requesting emails for all companies. This is ~80% cheaper than individual API calls.

---

## Frontend Components

### Existing Components (Unchanged)
- SearchBar (company selector)
- ResultCard (analysis display)

### New Components

#### 1. `SaveAnalysisButton.jsx`
Appears on ResultCard after analysis completes. One-click save with success feedback.

```
[💾 Save Analysis]
  ↓
  Saves to database
  ↓
  Shows toast: "Analysis saved!"
  ↓
  Button transitions to "✓ Saved"
```

---

#### 2. `FavoritesTab.jsx`
New tab/section in main nav. Shows list of saved companies with actions.

**Display**:
```
Favorites (5)
├── Company Name | Date | [⭐ Favorite] [📊 Compare] [🗑️ Delete]
├── Company Name | Date | [⭐ Favorite] [📊 Compare] [🗑️ Delete]
└── ...

Button: [Generate Emails for Selected]
```

**Features**:
- Click company name to view full analysis
- Checkbox selection for batch operations
- Star icon toggles favorite status
- Delete removes from database
- "Generate Emails" visible after selecting 2+ companies

---

#### 3. `CompareModal.jsx`
Side-by-side comparison of 2-3 saved companies.

**Layout** (responsive grid):
```
┌─────────────────────────────────────────────────────────────┐
│ Compare Companies: Werner vs Heartland vs CRST              │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Werner          │ Heartland       │ CRST                    │
├─────────────────┼─────────────────┼─────────────────────────┤
│ Profile         │ Profile         │ Profile                 │
│ [text]          │ [text]          │ [text]                  │
├─────────────────┼─────────────────┼─────────────────────────┤
│ Pain Points     │ Pain Points     │ Pain Points             │
│ • Routing...    │ • Owner-op...   │ • Cold chain...         │
│ • Driver comm   │ • Compliance    │ • Temp control          │
│ • Dispatch...   │ • Coordination  │ • Route optim...        │
├─────────────────┼─────────────────┼─────────────────────────┤
│ Tech Stack      │ Tech Stack      │ Tech Stack              │
│ [text]          │ [text]          │ [text]                  │
└─────────────────┴─────────────────┴─────────────────────────┘
```

**Features**:
- Remove individual companies from comparison
- Generate emails just for compared companies
- Export comparison as image/PDF

---

#### 4. `EmailGeneratorModal.jsx`
Select companies and generate batch emails.

**Flow**:
```
Step 1: Select Companies
[✓] Werner Enterprises
[ ] Heartland Express
[✓] CRST International
[✓] Dupre Logistics

Button: [Generate Emails for 3 Companies]
  ↓
Step 2: Loading
  "Generating personalized emails..."
  ↓
Step 3: Results
[Werner Enterprises]
═══════════════════════════════════════
Dear [Name],

I've been following Werner's expansion in regional LTL...
[Copy] [Download] [Edit]

[CRST International]
═══════════════════════════════════════
Dear [Name],

With CRST's refrigerated network across North America...
[Copy] [Download] [Edit]

...

Button: [Download All as .txt]
```

**Features**:
- Show loading state while generating
- Individual copy/download buttons per email
- Bulk download option
- Show which company each email is for
- Allow user to edit generated emails in-place

---

## UI/UX Design Principles (Maintaining Existing Aesthetic)

The new features must integrate seamlessly with the existing dark-themed, modern interface.

### Color Palette (Existing)
- Background: Dark gray/black (#0f172a)
- Accent: Blue/cyan (#3b82f6)
- Text: Light gray/white (#e5e7eb, #f3f4f6)
- Success: Green (#10b981)
- Warning/Error: Red (#ef4444)

### New Component Styling

**Save Button**: Cyan accent matching existing buttons
```
Idle: [💾 Save Analysis] (blue background)
Hover: Slightly lighter blue
Clicked: [✓ Saved] (green briefly, then back to blue)
```

**Favorites Tab**:
- Clean list layout matching existing dark theme
- Hover states for interactivity
- Icons for quick actions (star, compare, delete)
- Smooth transitions

**Compare Modal**:
- Dark overlay background
- Grid layout with clear column separation
- Alternating row backgrounds for readability (very subtle, ~5% opacity difference)
- Smooth scrolling if content exceeds viewport

**Email Generator Modal**:
- Monospace font for email bodies (shows professionalism)
- Email cards with clear separation
- Copy button provides visual feedback (checkmark animation)
- Download triggers browser download dialog

---

## Data Flow

### Save Analysis Workflow
```
User clicks [Save Analysis] on ResultCard
  ↓
Frontend: POST /api/save-analysis { companyName, analysisData }
  ↓
Backend: Insert into SQLite, return id + timestamp
  ↓
Frontend: Show success toast, update button state
  ↓
Analysis now appears in Favorites tab
```

### Generate Emails Workflow
```
User selects 2+ companies in Favorites
User clicks [Generate Emails]
  ↓
Frontend: Opens EmailGeneratorModal
User confirms companies
  ↓
Frontend: POST /api/generate-emails { companyIds: [1, 3, 5] }
  ↓
Backend:
  1. Query SQLite for full analysis data for companies 1, 3, 5
  2. Build batch prompt with all company info
  3. Send SINGLE API call to OpenAI with all companies
  4. Parse response
  5. Return emails array
  ↓
Frontend: Display emails in modal, allow copy/download
  ↓
User copies emails or downloads as file
```

---

## Cost Optimization

### API Call Reduction

**Without batch (naive approach)**:
- User wants emails for 5 companies
- 5 separate API calls to OpenAI
- Cost: 5 × $0.02 = $0.10 per batch

**With batch (our approach)**:
- User selects 5 companies
- 1 API call to OpenAI with batch prompt
- Cost: 1 × $0.05 = $0.05 per batch
- **Savings: 50% reduction**

For power users doing 10+ analyses per week, this adds up to significant cost savings and shows sophisticated thinking about resource optimization.

---

## Error Handling & Edge Cases

### Database Errors
- **Save fails**: Show error toast "Failed to save. Please try again." with retry button
- **Connection lost**: Queue save requests, retry when reconnected

### API Generation Errors
- **Email generation fails**: Show fallback option "Use template instead" with generic email
- **Partial failure**: If batch request fails, show which companies succeeded and which failed

### User Experience
- **No saved analyses**: Show encouraging empty state ("Analyze your first company to get started!")
- **Duplicate saves**: Allow (user might re-analyze company later for updated intel)
- **Network timeout**: Graceful timeout with user-friendly message

---

## Testing Strategy

### Unit Tests
- SQLite CRUD operations (save, retrieve, delete, favorite toggle)
- Email batch prompt generation (correct formatting)
- API response parsing

### Integration Tests
- Save analysis → Retrieve from Favorites → Generate emails workflow
- Compare view with 2-3 companies displays correctly
- Email generation with various company combinations

### Manual Testing
- Test on desktop and mobile for responsive design
- Verify dark theme consistency across all new components
- Test error states (network failure, API timeout, etc.)

---

## Success Criteria

✅ **Technical**:
- SQLite database persists analyses correctly
- All 6 API endpoints functional
- Batch email generation works for 2+ companies
- No errors in console

✅ **UX**:
- New features integrate seamlessly with existing UI
- Dark theme maintained across new components
- All interactions provide feedback (toasts, loading states, animations)
- Mobile responsive

✅ **Impression**:
- Demonstrates database design thinking (SQLite)
- Shows API endpoint architecture skills
- Proves cost optimization mindset (batch processing)
- Looks polished and professional

---

## Implementation Sequence

See `writing-plans` skill output for detailed implementation steps and priority ordering.

Key phases:
1. **Database layer**: Create SQLite schema and CRUD endpoints
2. **Backend email generation**: Implement batch prompt and endpoint
3. **Frontend storage**: Add FavoritesTab and SaveButton
4. **Frontend generation**: Add EmailGeneratorModal and CompareModal
5. **Polish**: Styling, error handling, edge cases
