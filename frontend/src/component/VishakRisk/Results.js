import React from "react";
import Swal from "sweetalert2";

const Results = ({ prediction }) => {
  if (!prediction) return null;

  const showConfirmation = () => {
    Swal.fire({
      title: "Prediction Results",
      html: `
        <p><strong>🩺 Predicted Risk:</strong> ${prediction.predicted_risk}</p>
        <p><strong>📊 Confidence Level:</strong> ${prediction.confidence}%</p>
        <h4>📈 Top SHAP Feature Impacts:</h4>
        <ul>
          ${prediction.shap_values.map(([feature, impact]) => `
            <li>${impact > 0 ? "🟢" : "🔴"} <strong>${feature}:</strong> ${impact.toFixed(4)}</li>
          `).join("")}
        </ul>
      `,
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#3b82f6",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">🔍 Prediction Results</h3>
      <p className="mb-2"><strong>🩺 Predicted Risk:</strong> {prediction.predicted_risk}</p>
      <p className="mb-4"><strong>📊 Confidence Level:</strong> {prediction.confidence}%</p>

      <h4 className="text-lg font-semibold mb-2">📈 Top SHAP Feature Impacts:</h4>
      <ul className="list-disc pl-5">
        {prediction.shap_values.map(([feature, impact]) => (
          <li key={feature} className="mb-1">
            {impact > 0 ? "🟢" : "🔴"} <strong>{feature}:</strong> {impact.toFixed(4)}
          </li>
        ))}
      </ul>

      <button
        onClick={showConfirmation}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Show Detailed Results
      </button>
    </div>
  );
};

export default Results;