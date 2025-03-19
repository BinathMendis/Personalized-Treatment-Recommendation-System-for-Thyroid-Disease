import React from "react";

const Results = ({ result }) => {
  if (!result) return <p>⚠️ No prediction available.</p>;

  const { predicted_risk, confidence, shap_values } = result || {};

  // ✅ Fix: Ensure SHAP values are properly sorted & displayed
  const sortedShap = Object.entries(shap_values || {})
    .sort(([, impactA], [, impactB]) => Math.abs(impactB) - Math.abs(impactA))
    .slice(0, 3);

  return (
    <div>
      <h3>🩺 Prediction Result</h3>
      <p>**Risk Level:** <strong>{predicted_risk}</strong></p>
      <p>**Confidence:** <strong>{(confidence * 100).toFixed(2)}%</strong></p>

      <h4>📈 Top Contributing Factors (SHAP Impact):</h4>
      <ul>
        {sortedShap.map(([feature, impact]) => (
          <li key={feature}>
            {impact >= 0 ? "🟢" : "🔴"} <strong>{feature.toUpperCase()}:</strong> {impact.toFixed(4)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
