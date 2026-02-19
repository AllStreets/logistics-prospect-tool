import { useMemo } from 'react';
import './SDRScoreCard.css';

export default function SDRScoreCard({ company, painPoints }) {
  const scores = useMemo(() => {
    // Fit for HappyRobot (based on fleet size and company type)
    let fitScore = 3;
    if (company.fleetSize >= 10000) fitScore = 5;
    else if (company.fleetSize >= 5000) fitScore = 4;
    else if (company.fleetSize >= 2000) fitScore = 3;
    else if (company.fleetSize >= 500) fitScore = 2;

    // Pain Point Alignment (based on pain points matching HappyRobot solution)
    let alignmentScore = 3;
    if (painPoints && Array.isArray(painPoints)) {
      const relevantKeywords = ['communication', 'dispatch', 'coordination', 'driver', 'coordination', 'compliance'];
      const matchCount = painPoints.filter(p =>
        relevantKeywords.some(keyword => p.toLowerCase().includes(keyword))
      ).length;
      alignmentScore = Math.min(5, 2 + matchCount);
    }

    // Decision Timeline (based on company type)
    let timelineScore = 3;
    if (company.companyType === 'digital_platform') timelineScore = 5;
    else if (company.companyType === 'regional_carrier') timelineScore = 4;
    else if (company.companyType === 'owner_operator') timelineScore = 3;
    else if (company.companyType === 'specialty_carrier') timelineScore = 2;

    const overallScore = ((fitScore + alignmentScore + timelineScore) / 3).toFixed(1);

    return {
      fit: { score: fitScore, reason: `${company.companyType.replace(/_/g, ' ')}, ${company.fleetSize.toLocaleString()} trucks` },
      alignment: { score: alignmentScore, reason: `${painPoints?.length || 0} pain points identified` },
      timeline: { score: timelineScore, reason: company.companyType === 'digital_platform' ? 'Tech-forward company' : 'Traditional carrier' },
      overall: overallScore
    };
  }, [company, painPoints]);

  const StarRating = ({ score }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= score ? 'filled' : 'empty'} ${score >= 4 ? 'green' : score >= 3 ? 'yellow' : 'red'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="sdr-score-card-section">
      <div className="section-header scorecard-header">
        <h3>SDR Score Card</h3>
      </div>
      <div className="section-content">
        <div className="overall-score">
          <h4>Prospect Quality</h4>
          <div className="overall-rating">
            <StarRating score={Math.round(scores.overall)} />
            <span className="score-value">{scores.overall}/5</span>
          </div>
          <p className="score-note">Higher score = better fit for HappyRobot</p>
        </div>

        <div className="scores-grid">
          <div className="score-item">
            <h5>Fit for HappyRobot</h5>
            <StarRating score={scores.fit.score} />
            <p className="score-reason">{scores.fit.reason}</p>
          </div>

          <div className="score-item">
            <h5>Pain Point Alignment</h5>
            <StarRating score={scores.alignment.score} />
            <p className="score-reason">{scores.alignment.reason}</p>
          </div>

          <div className="score-item">
            <h5>Decision Timeline</h5>
            <StarRating score={scores.timeline.score} />
            <p className="score-reason">{scores.timeline.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
