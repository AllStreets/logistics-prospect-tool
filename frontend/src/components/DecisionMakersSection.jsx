import './DecisionMakersSection.css';

export default function DecisionMakersSection({ decisionMakers }) {
  if (!decisionMakers || decisionMakers.length === 0) {
    return null;
  }

  return (
    <div className="decision-makers-section">
      <div className="section-header decision-makers-header">
        <h3>Decision Makers</h3>
      </div>
      <div className="section-content">
        {decisionMakers.map((maker, idx) => (
          <div key={idx} className="decision-maker-card">
            <h4 className="maker-title">{maker.title}</h4>
            <ul className="maker-concerns">
              {maker.concerns && maker.concerns.map((concern, i) => (
                <li key={i}>{concern}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
