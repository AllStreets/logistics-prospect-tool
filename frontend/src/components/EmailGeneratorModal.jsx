import { useState, useEffect } from 'react';
import './EmailGeneratorModal.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EmailGeneratorModal({ emailIds, isOpen, onClose }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isOpen && emailIds && emailIds.length > 0) {
      generateEmails();
    }
  }, [isOpen, emailIds]);

  const generateEmails = async () => {
    setLoading(true);
    setError('');
    setEmails([]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyIds: emailIds })
      });

      if (!response.ok) throw new Error('Failed to generate emails');
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (err) {
      setError('Failed to generate emails. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadAllEmails = () => {
    const content = emails
      .map(e => `${e.companyName}\n${'='.repeat(40)}\n${e.email}\n`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emails-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="email-overlay" onClick={onClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
        <div className="email-header">
          <h2>Generated Emails</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={generateEmails}>Try Again</button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Generating personalized emails...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="empty-state">
            <p>No emails generated</p>
          </div>
        ) : (
          <>
            <div className="emails-container">
              {emails.map((email, idx) => (
                <div key={idx} className="email-card">
                  <div className="email-card-header">
                    <h3>{email.companyName}</h3>
                  </div>
                  <div className="email-content">
                    <p>{email.email}</p>
                  </div>
                  <div className="email-actions">
                    <button
                      className={`copy-btn ${copiedId === idx ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(email.email, idx)}
                    >
                      {copiedId === idx ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                      className="download-btn"
                      onClick={() => {
                        const blob = new Blob([email.email], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${email.companyName.replace(/\s+/g, '-')}-email.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="email-footer">
              <button className="download-all-btn" onClick={downloadAllEmails}>
                ⬇️ Download All Emails
              </button>
              <button className="close-modal-btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
