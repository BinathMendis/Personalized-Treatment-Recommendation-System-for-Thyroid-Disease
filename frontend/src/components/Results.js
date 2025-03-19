import React from "react";

const Results = ({ prediction }) => {
  if (!prediction || !prediction.predicted_risk) {
    return <p className="text-red-500 font-semibold text-center">⚠️ No prediction available.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">🔍 Prediction Results</h3>

      <div className="p-4 bg-gray-100 rounded-md">
        <p className="text-lg">
          <strong>🩺 Predicted Risk:</strong> <span className="text-blue-600">{prediction.predicted_risk}</span>
        </p>
        <p className="text-lg">
          <strong>📊 Confidence Level:</strong> <span className="text-green-600">{prediction.confidence}%</span>
        </p>
      </div>

      {/* SHAP Values */}
      <h4 className="text-lg font-semibold text-gray-700 mt-4">📈 Top Contributing Factors (SHAP Impact):</h4>
      <ul className="mt-2">
        {prediction.shap_values.map(([feature, impact]) => (
          <li key={feature} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md shadow-sm my-1">
            <span className={impact > 0 ? "text-green-500" : "text-red-500"}>
              {impact > 0 ? "🟢" : "🔴"}
            </span>
            <strong className="text-gray-700">{feature}:</strong>
            <span className="text-gray-800">{impact.toFixed(4)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
