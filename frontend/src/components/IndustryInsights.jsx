import { useState, useEffect } from 'react';
import './IndustryInsights.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fallback default insights
const DEFAULT_INSIGHTS = [
  {
    id: 1,
    title: 'Driver Communication Gap',
    fact: 'Drivers spend 2-3 hours per week on manual coordination calls',
    relevance: 'HappyRobot solution: Automate 80% of coordination calls, freeing driver time for productive work',
    tags: ['communication', 'efficiency']
  },
  {
    id: 2,
    title: 'Compliance & Regulations',
    fact: 'DOT violations increased 30% year-over-year; each violation costs $5,000+',
    relevance: 'HappyRobot solution: Automated tracking ensures 100% compliance with evolving regulations',
    tags: ['compliance', 'safety', 'cost']
  }
];

export default function IndustryInsights({ companyType = 'regional_carrier' }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/data/insights`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Slice first 2 insights (in production would filter by company type tags)
      const selectedInsights = Array.isArray(data) ? data.slice(0, 2) : DEFAULT_INSIGHTS;
      setInsights(selectedInsights);
    } catch (err) {
      console.error('Failed to load insights:', err);
      setError(err.message);
      // Fall back to default insights
      setInsights(DEFAULT_INSIGHTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [companyType]);

  if (loading) {
    return (
      <section className="industry-insights">
        <div className="insights-header">
          <h2>Industry Insights</h2>
          <p>Loading relevant logistics trends...</p>
        </div>
        <div className="insights-grid">
          <div className="loading-skeleton"></div>
          <div className="loading-skeleton"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="industry-insights">
      <div className="insights-header">
        <h2>Industry Insights</h2>
        <p>Relevant logistics trends and opportunities</p>
      </div>

      <div className="insights-grid">
        {insights.map((insight) => (
          <div key={insight.id} className="insight-card">
            <h3 className="insight-title">{insight.title}</h3>
            <p className="insight-fact">{insight.fact}</p>
            <div className="insight-relevance">
              <span className="relevance-label">HappyRobot Impact</span>
              <p>{insight.relevance}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="insights-footer">
          <p className="error-message">Using cached insights • {error}</p>
        </div>
      )}
    </section>
  );
}
