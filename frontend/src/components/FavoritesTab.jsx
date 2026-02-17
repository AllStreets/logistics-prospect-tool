import { useState, useEffect } from 'react';
import './FavoritesTab.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function FavoritesTab({ onAnalysisSelect, isOpen, onClose }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-analyses`);
      if (!response.ok) throw new Error('Failed to load favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError('Failed to load saved analyses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-analyses/${id}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !currentStatus })
      });
      if (!response.ok) throw new Error('Failed to update');

      // Update local state
      setFavorites(favorites.map(f =>
        f.id === id ? { ...f, is_favorite: !currentStatus } : f
      ));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const deleteAnalysis = async (id) => {
    if (!confirm('Delete this analysis?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-analyses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');

      setFavorites(favorites.filter(f => f.id !== id));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const toggleSelection = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleCompare = () => {
    if (selectedIds.size < 2) {
      alert('Select 2 or more companies to compare');
      return;
    }
    onAnalysisSelect({ type: 'compare', ids: Array.from(selectedIds) });
  };

  const handleGenerateEmails = () => {
    if (selectedIds.size === 0) {
      alert('Select at least one company');
      return;
    }
    onAnalysisSelect({ type: 'email', ids: Array.from(selectedIds) });
  };

  if (!isOpen) return null;

  return (
    <div className="favorites-overlay" onClick={onClose}>
      <div className="favorites-panel" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-header">
          <h2>Saved Analyses ({favorites.length})</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <p>No saved analyses yet. Analyze a company and click "Save Analysis" to get started!</p>
          </div>
        ) : (
          <>
            <div className="favorites-list">
              {favorites.map(fav => (
                <div key={fav.id} className="favorite-item">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(fav.id)}
                    onChange={() => toggleSelection(fav.id)}
                    className="item-checkbox"
                  />
                  <div className="item-info">
                    <h3>{fav.company_name}</h3>
                    <p>{new Date(fav.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      className={`star-btn ${fav.is_favorite ? 'active' : ''}`}
                      onClick={() => toggleFavorite(fav.id, fav.is_favorite)}
                      title="Toggle favorite"
                    >
                      ⭐
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteAnalysis(fav.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedIds.size > 0 && (
              <div className="action-buttons">
                <button
                  className="compare-btn"
                  onClick={handleCompare}
                  disabled={selectedIds.size < 2}
                >
                  📊 Compare ({selectedIds.size})
                </button>
                <button
                  className="email-btn"
                  onClick={handleGenerateEmails}
                >
                  📧 Generate Emails ({selectedIds.size})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
