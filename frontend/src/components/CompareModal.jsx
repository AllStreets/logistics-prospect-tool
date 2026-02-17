import { useState, useEffect } from 'react';
import './CompareModal.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CompareModal({ analysisIds, isOpen, onClose, onGenerateEmails }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && analysisIds && analysisIds.length > 0) {
      loadAnalyses();
    }
  }, [isOpen, analysisIds]);

  const loadAnalyses = async () => {
    setLoading(true);
    setError('');
    try {
      const promises = analysisIds.map(id =>
        fetch(`${API_BASE_URL}/api/saved-analyses/${id}`).then(r => r.json())
      );
      const data = await Promise.all(promises);
      setAnalyses(data);
    } catch (err) {
      setError('Failed to load analyses for comparison');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromComparison = (id) => {
    const remaining = analyses.filter(a => a.id !== id);
    if (remaining.length === 0) {
      onClose();
    } else {
      setAnalyses(remaining);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compare-header">
          <h2>Compare Companies</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading analyses...</div>
        ) : (
          <>
            <div className="compare-grid">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="compare-column">
                  <div className="column-header">
                    <h3>{analysis.company_name}</h3>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromComparison(analysis.id)}
                      title="Remove from comparison"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="compare-section">
                    <h4>Profile</h4>
                    <p>{analysis.analysisData.profile}</p>
                  </div>

                  <div className="compare-section">
                    <h4>Pain Points</h4>
                    <ul>
                      {analysis.analysisData.painPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="compare-section">
                    <h4>Tech Stack</h4>
                    <p>{analysis.analysisData.techStack}</p>
                  </div>

                  <div className="compare-section">
                    <h4>Outreach Angle</h4>
                    <p>{analysis.analysisData.outreachAngle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="compare-actions">
              <button
                className="email-btn"
                onClick={() => onGenerateEmails(analyses.map(a => a.id))}
              >
                📧 Generate Emails for {analyses.length} Companies
              </button>
              <button className="close-modal-btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
