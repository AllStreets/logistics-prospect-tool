import './ResultCard.css';
import SaveAnalysisButton from './SaveAnalysisButton';

export default function ResultCard({ title, content, icon, index, showSaveButton, companyName, analysisData, onSaved }) {
  // Only show save button on the last card (Outreach Angle)
  const isFinalCard = title === 'Outreach Angle';

  return (
    <div className="result-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="card-content">
        {Array.isArray(content) ? (
          <ul>
            {content.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{content}</p>
        )}
      </div>
      {isFinalCard && showSaveButton && (
        <SaveAnalysisButton
          companyName={companyName}
          analysisData={analysisData}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
