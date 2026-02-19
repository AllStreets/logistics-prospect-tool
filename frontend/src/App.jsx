import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import FavoritesTab from './components/FavoritesTab';
import CompareModal from './components/CompareModal';
import EmailGeneratorModal from './components/EmailGeneratorModal';
import DecisionMakersSection from './components/DecisionMakersSection';
import ROICalculator from './components/ROICalculator';
import IndustryInsights from './components/IndustryInsights';
import SDRScoreCard from './components/SDRScoreCard';
import EmailTemplatesSection from './components/EmailTemplatesSection';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [companies, setCompanies] = useState([]);
  const [results, setResults] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [showEmailGenerator, setShowEmailGenerator] = useState(false);
  const [emailIds, setEmailIds] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`);
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies');
      console.error(err);
    }
  };

  const handleSearch = async (companyName) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName })
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setResults(data);

      // Find and set the selected company from the companies list
      const company = companies.find(c => c.name === companyName);
      setSelectedCompany(company || { name: companyName, fleetSize: null, companyType: null });
    } catch (err) {
      setError('Failed to analyze company');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaved = (saveData) => {
    console.log('Analysis saved:', saveData);
  };

  const handleAnalysisAction = (action) => {
    if (action.type === 'compare') {
      setCompareIds(action.ids);
      setShowCompare(true);
    } else if (action.type === 'email') {
      setEmailIds(action.ids);
      setShowEmailGenerator(true);
    }
    setShowFavorites(false);
  };

  const handleGenerateEmails = (ids) => {
    setCompareIds([]);
    setShowCompare(false);
    setEmailIds(ids);
    setShowEmailGenerator(true);
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-top">
          <h1>Prospect Intelligence</h1>
          <button
            className="favorites-tab-btn"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            📋 Saved ({showFavorites ? '✓' : ''})
          </button>
        </div>
        <p>AI-powered logistics company analysis for HappyRobot SDR outreach</p>
      </div>

      <div className="main-content">
        <SearchBar
          companies={companies}
          onSearch={handleSearch}
          loading={loading}
        />

        {error && (
          <div className="error-message" style={{ color: '#ef4444', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {results && selectedCompany && (
          <div className="results-container">
            <ResultCard
              title="Company Profile"
              content={results.profile}
              icon="🏢"
              index={0}
              showSaveButton={true}
              companyName={results.company}
              analysisData={results}
              onSaved={handleSaved}
            />
            <ResultCard
              title="Pain Points"
              content={results.painPoints}
              icon="⚠️"
              index={1}
              showSaveButton={true}
              companyName={results.company}
              analysisData={results}
              onSaved={handleSaved}
            />
            <ResultCard
              title="Tech Stack"
              content={results.techStack}
              icon="💻"
              index={2}
              showSaveButton={true}
              companyName={results.company}
              analysisData={results}
              onSaved={handleSaved}
            />
            <ResultCard
              title="Outreach Angle"
              content={results.outreachAngle}
              icon="🎯"
              index={3}
              showSaveButton={true}
              companyName={results.company}
              analysisData={results}
              onSaved={handleSaved}
            />
            <DecisionMakersSection
              decisionMakers={results.decisionMakers}
            />
            <ROICalculator
              companyFleetSize={selectedCompany.fleetSize}
            />
            <IndustryInsights
              companyType={selectedCompany.companyType}
            />
            <SDRScoreCard
              company={selectedCompany}
              painPoints={results.painPoints}
            />
            <EmailTemplatesSection
              companyName={selectedCompany.name}
              painPoints={results.painPoints}
            />
          </div>
        )}
      </div>

      <FavoritesTab
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        onAnalysisSelect={handleAnalysisAction}
      />

      <CompareModal
        analysisIds={compareIds}
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        onGenerateEmails={handleGenerateEmails}
      />

      <EmailGeneratorModal
        emailIds={emailIds}
        isOpen={showEmailGenerator}
        onClose={() => setShowEmailGenerator(false)}
      />
    </div>
  );
}

export default App;
