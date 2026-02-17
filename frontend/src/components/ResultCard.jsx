import './ResultCard.css';

export default function ResultCard({ title, content, icon, index }) {
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
    </div>
  );
}
