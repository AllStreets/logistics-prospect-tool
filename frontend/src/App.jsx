import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [companies, setCompanies] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="app-container">
      <div className="header">
        <h1>Prospect Intelligence</h1>
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

        {results && (
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
              title="Tech Stack"
              content={results.techStack}
              icon="💻"
              index={1}
              showSaveButton={true}
              companyName={results.company}
              analysisData={results}
              onSaved={handleSaved}
            />
            <ResultCard
              title="Pain Points"
              content={results.painPoints}
              icon="⚠️"
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
