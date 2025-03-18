import React from "react";

const Results = ({ prediction, onRestart }) => {
  if (!prediction) return null;

  return (
    <div className="results">
      <h2>🩺 Thyroid Disease Prediction</h2>

      <h3>🔍 Prediction Results</h3>
      <p><strong>🩸 Predicted Risk:</strong> {prediction.predicted_risk}</p>
      <p><strong>📊 Confidence Level:</strong> {prediction.confidence.toFixed(2)}%</p>

      <h4>📈 Top Contributing Factors (SHAP Impact):</h4>
      <ul>
        {prediction.shap_values.map(([feature, impact]) => (
          <li key={feature} style={{ color: impact > 0 ? "green" : "red" }}>
            {impact > 0 ? "🟢" : "🔴"} <strong>{feature}:</strong> {impact.toFixed(4)}
          </li>
        ))}
      </ul>

      {/* 🔄 Restart Button */}
      <button onClick={onRestart} style={{ marginTop: "15px" }}>
        🔄 Start Over
      </button>
    </div>
  );
};

export default Results;
