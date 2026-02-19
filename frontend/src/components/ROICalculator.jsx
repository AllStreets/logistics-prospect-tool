import { useState, useEffect } from 'react';
import './ROICalculator.css';

export default function ROICalculator({ companyFleetSize = 5000 }) {
  const [inputs, setInputs] = useState({
    fleetSize: companyFleetSize,
    dailyCallsPerTruck: 4,
    coordCostPerCall: 3.5,
    turnoverRate: 30,
    violationsPerMonth: 2
  });

  const [outputs, setOutputs] = useState(null);

  // Recalculate whenever inputs change
  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    const { fleetSize, dailyCallsPerTruck, coordCostPerCall, turnoverRate, violationsPerMonth } = inputs;

    // Annual hours saved (assuming 15 minutes per call, 80% automation)
    const callsPerYear = dailyCallsPerTruck * fleetSize * 365;
    const automatedCalls = callsPerYear * 0.8;
    const minutesSaved = automatedCalls * 15;
    const hoursSaved = minutesSaved / 60;

    // Annual violations prevented (assuming 50% reduction)
    const violationsPerYear = violationsPerMonth * 12;
    const violationsPrevented = Math.round(violationsPerYear * 0.5);

    // Annual cost savings
    const callCostSavings = automatedCalls * coordCostPerCall;
    const violationCostSavings = violationsPrevented * 2500; // Avg $2,500 per violation prevented
    const retentionSavings = (fleetSize * 0.1) * 7500; // 10% retention improvement, $7,500 per driver replacement
    const totalSavings = callCostSavings + violationCostSavings + retentionSavings;

    // HappyRobot implementation cost estimate
    const implementationCost = fleetSize * 50; // $50 per truck per year
    const netROI = totalSavings - implementationCost;
    const roiPercentage = ((netROI / implementationCost) * 100).toFixed(0);

    setOutputs({
      hoursSaved: Math.round(hoursSaved),
      violationsPrevented,
      callCostSavings: Math.round(callCostSavings),
      violationCostSavings: Math.round(violationCostSavings),
      retentionSavings: Math.round(retentionSavings),
      totalSavings: Math.round(totalSavings),
      implementationCost: Math.round(implementationCost),
      netROI: Math.round(netROI),
      roiPercentage
    });
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  if (!outputs) return null;

  return (
    <div className="roi-calculator-section">
      <div className="section-header roi-header">
        <h3>ROI Calculator</h3>
      </div>
      <div className="section-content">
        <div className="calculator-grid">
          {/* Inputs Column */}
          <div className="calculator-column inputs-column">
            <h4>Adjust Parameters</h4>
            <div className="input-group">
              <label>Fleet Size (trucks)</label>
              <input
                type="range"
                min="100"
                max="50000"
                value={inputs.fleetSize}
                onChange={(e) => handleInputChange('fleetSize', e.target.value)}
              />
              <span className="input-value">{inputs.fleetSize}</span>
            </div>
            <div className="input-group">
              <label>Daily Calls/Truck</label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={inputs.dailyCallsPerTruck}
                onChange={(e) => handleInputChange('dailyCallsPerTruck', e.target.value)}
              />
              <span className="input-value">{inputs.dailyCallsPerTruck.toFixed(1)}</span>
            </div>
            <div className="input-group">
              <label>Cost/Call ($)</label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={inputs.coordCostPerCall}
                onChange={(e) => handleInputChange('coordCostPerCall', e.target.value)}
              />
              <span className="input-value">${inputs.coordCostPerCall.toFixed(2)}</span>
            </div>
            <div className="input-group">
              <label>Turnover Rate (%)</label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={inputs.turnoverRate}
                onChange={(e) => handleInputChange('turnoverRate', e.target.value)}
              />
              <span className="input-value">{inputs.turnoverRate}%</span>
            </div>
            <div className="input-group">
              <label>Violations/Month</label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={inputs.violationsPerMonth}
                onChange={(e) => handleInputChange('violationsPerMonth', e.target.value)}
              />
              <span className="input-value">{inputs.violationsPerMonth}</span>
            </div>
          </div>

          {/* Outputs Column */}
          <div className="calculator-column outputs-column">
            <h4>Annual Impact</h4>
            <div className="output-group">
              <span className="output-label">Hours Saved</span>
              <span className="output-value">{outputs.hoursSaved.toLocaleString()}</span>
              <span className="output-unit">hours</span>
            </div>
            <div className="output-group">
              <span className="output-label">Violations Prevented</span>
              <span className="output-value">{outputs.violationsPrevented}</span>
              <span className="output-unit">incidents</span>
            </div>
            <div className="output-group highlight">
              <span className="output-label">Total Annual Savings</span>
              <span className="output-value">${outputs.totalSavings.toLocaleString()}</span>
              <span className="output-unit">all benefits combined</span>
            </div>
            <div className="output-breakdown">
              <div className="breakdown-item">
                <span>Call Automation: ${outputs.callCostSavings.toLocaleString()}</span>
              </div>
              <div className="breakdown-item">
                <span>Violation Prevention: ${outputs.violationCostSavings.toLocaleString()}</span>
              </div>
              <div className="breakdown-item">
                <span>Retention Improvement: ${outputs.retentionSavings.toLocaleString()}</span>
              </div>
            </div>
            <div className="output-group roi-summary">
              <span className="output-label">Implementation Cost</span>
              <span className="output-value">${outputs.implementationCost.toLocaleString()}</span>
              <span className="output-unit">annual</span>
            </div>
            <div className="output-group roi-final">
              <span className="output-label">Net Annual ROI</span>
              <span className="output-value green">${outputs.netROI.toLocaleString()}</span>
              <span className="output-unit">({outputs.roiPercentage}% return)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
