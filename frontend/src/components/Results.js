import React from "react";

const Results = ({ prediction, confidence, shapValues }) => {
  if (!prediction) return <p>⚠️ No prediction available.</p>;

  // ✅ Fix: Map SHAP values to correct feature names
  const featureMapping = {
    tsh: "TSH",
    t3: "T3",
    t4: "T4",
    weight_kg: "Weight",
    height_cm: "Height",
    age: "Age", // ✅ Age should only be shown if it's relevant
  };

  // ✅ Fix: Ensure we display the top 3 correct SHAP features
  const sortedShap = Object.entries(shapValues || {})
    .sort(([, impactA], [, impactB]) => Math.abs(impactB) - Math.abs(impactA))
    .slice(0, 3);

  return (
    <div>
      <h3>🩺 Prediction Result</h3>
      <p>
        **Risk Level:** <strong>{prediction}</strong>
      </p>
      <p>
        **Confidence:** <strong>{(confidence * 100).toFixed(2)}%</strong>
      </p>

      <h4>📈 Top Contributing Factors (SHAP Impact):</h4>
      <ul>
        {sortedShap.map(([feature, impact]) => (
          <li key={feature}>
            {impact >= 0 ? "🟢" : "🔴"} <strong>{featureMapping[feature] || feature}:</strong>{" "}
            {impact.toFixed(4)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
