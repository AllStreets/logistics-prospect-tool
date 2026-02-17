const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Load companies data
const companies = require('./data/companies.json');
const { aggregateCompanyData } = require('./services/dataAggregator');
const { synthesizeIntelligence } = require('./services/claudeSynthesizer');
const {
  saveAnalysis,
  getAllAnalyses,
  getAnalysisById,
  toggleFavorite,
  deleteAnalysis,
  getAnalysesByIds
} = require('./services/database');

// Route to get all companies
app.get('/api/companies', (req, res) => {
  res.json(companies);
});

// Route to get single company
app.get('/api/companies/:id', (req, res) => {
  const company = companies.find(c => c.id === parseInt(req.params.id));
  if (!company) return res.status(404).json({ error: 'Company not found' });
  res.json(company);
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'Company name required' });
    }

    // Aggregate data from sources
    const aggregatedData = await aggregateCompanyData(companyName);

    // Synthesize with Claude
    const intelligence = await synthesizeIntelligence(aggregatedData);

    res.json({
      company: companyName,
      ...intelligence,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// NEW: Save analysis to database
app.post('/api/save-analysis', async (req, res) => {
  try {
    const { companyName, analysisData } = req.body;

    if (!companyName || !analysisData) {
      return res.status(400).json({ error: 'Company name and analysis data required' });
    }

    const result = await saveAnalysis(companyName, analysisData);
    res.json(result);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Get all saved analyses
app.get('/api/saved-analyses', async (req, res) => {
  try {
    const analyses = await getAllAnalyses();
    res.json(analyses);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Get single saved analysis
app.get('/api/saved-analyses/:id', async (req, res) => {
  try {
    const analysis = await getAnalysisById(parseInt(req.params.id));
    res.json(analysis);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(404).json({ error: error.message });
  }
});

// NEW: Toggle favorite status
app.put('/api/saved-analyses/:id/favorite', async (req, res) => {
  try {
    const { is_favorite } = req.body;
    const result = await toggleFavorite(parseInt(req.params.id), is_favorite);
    res.json(result);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Delete saved analysis
app.delete('/api/saved-analyses/:id', async (req, res) => {
  try {
    const result = await deleteAnalysis(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
