import './ResultCard.css';
import SaveAnalysisButton from './SaveAnalysisButton';

const sectionColors = {
  'Company Profile': { primary: '#3b82f6', secondary: '#2563eb', border: '#3b82f6' },
  'Tech Stack': { primary: '#a855f7', secondary: '#9333ea', border: '#a855f7' },
  'Pain Points': { primary: '#06b6d4', secondary: '#0891b2', border: '#06b6d4' },
  'Outreach Angle': { primary: '#4f46e5', secondary: '#4338ca', border: '#4f46e5' }
};

export default function ResultCard({ title, content, icon, index, showSaveButton, companyName, analysisData, onSaved }) {
  // Only show save button on the last card (Outreach Angle)
  const isFinalCard = title === 'Outreach Angle';
  const colors = sectionColors[title] || sectionColors['Company Profile'];

  return (
    <div className="result-card" style={{ animationDelay: `${index * 0.1}s`, borderLeftColor: colors.border }}>
      <div className="card-header" style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}>
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
