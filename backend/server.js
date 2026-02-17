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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
