import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ companies, onSearch, loading }) {
  const [selectedId, setSelectedId] = useState('');

  const handleSelect = (id) => {
    setSelectedId(id);
    const company = companies.find(c => c.id === parseInt(id));
    if (company) {
      onSearch(company.name);
    }
  };

  return (
    <div className="search-container">
      <div className="select-wrapper">
        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          disabled={loading}
          className="company-select"
        >
          <option value="">Select a logistics company...</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name} • {company.type}
            </option>
          ))}
        </select>
        <div className="select-arrow">▼</div>
      </div>
      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}
