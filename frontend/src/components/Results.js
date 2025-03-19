import React from "react";

const Results = ({ prediction }) => {
  if (!prediction || !prediction.predicted_risk) {
    return <p>⚠️ No prediction available.</p>;
  }

  return (
    <div className="results">
      <h3>🔍 Prediction Results</h3>
      <p><strong>🩺 Predicted Risk:</strong> {prediction.predicted_risk}</p>
      <p><strong>📊 Confidence Level:</strong> {prediction.confidence}%</p>

      <h4>📈 Top Contributing Factors (SHAP Impact):</h4>
      <ul>
        {prediction.shap_values.map(([feature, impact]) => (
          <li key={feature}>
            {impact > 0 ? "🟢" : "🔴"} <strong>{feature}:</strong> {impact.toFixed(4)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
