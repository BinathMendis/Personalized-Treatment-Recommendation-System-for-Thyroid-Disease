import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onPrediction }) => {
  const [extractedValues, setExtractedValues] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [prediction, setPrediction] = useState(null); // Store prediction result

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus("");
    setPrediction(null); // Reset previous prediction
  };

  // Handle file upload & prediction
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        "http://127.0.0.1:8000/extract_lab_values",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadStatus("✅ Extraction Successful!");
      const extractedData = response.data.extracted_values;
      console.log("Extracted Data:", extractedData);

      // 🔥 Store extracted values in state
      setExtractedValues(extractedData);

      // ✅ Stop if extraction fails
      if (!extractedData || Object.keys(extractedData).length === 0) {
        setUploadStatus("⚠️ No valid lab values extracted. Please check the report.");
        return;
      }

      // ✅ Prepare data for prediction
      const predictionData = {
        age: extractedData.age || 0,
        gender: extractedData.gender || "Unknown",
        weight_kg: extractedData.weight_kg || 0.0,
        height_cm: extractedData.height_cm || 0.0,
        tsh: extractedData.tsh || null,
        t3: extractedData.t3 || null,
        t4: extractedData.t4 || null,
      };

      console.log("Sending to Prediction API:", predictionData);

      // 🔥 FIX: Call /predict API only after showing extracted values
      const predictResponse = await axios.post(
        "http://127.0.0.1:8000/predict",
        predictionData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setPrediction(predictResponse.data);
      console.log("Prediction Response:", predictResponse.data);
    } catch (error) {
      setUploadStatus("❌ Upload Failed. Try again.");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="file-upload">
      <h3>📄 Upload Lab Report</h3>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <button onClick={handleUpload}>Upload & Predict</button>
      <p>{uploadStatus}</p>

      {/* ✅ Display Extracted Lab Values */}
      {extractedValues && (
        <div className="extracted-values">
          <h3>🧪 Extracted Lab Values</h3>
          <p><strong>Age:</strong> {extractedValues.age || "Not Detected"}</p>
          <p><strong>Gender:</strong> {extractedValues.gender || "Not Detected"}</p>
          <p><strong>Weight:</strong> {extractedValues.weight_kg || "Not Detected"} kg</p>
          <p><strong>Height:</strong> {extractedValues.height_cm || "Not Detected"} cm</p>
          <p><strong>TSH:</strong> {extractedValues.tsh !== null ? extractedValues.tsh : "Not Detected"}</p>
          <p><strong>T3:</strong> {extractedValues.t3 !== null ? extractedValues.t3 : "Not Detected"}</p>
          <p><strong>T4:</strong> {extractedValues.t4 !== null ? extractedValues.t4 : "Not Detected"}</p>
        </div>
      )}

      {/* ✅ Display Prediction Results */}
      {prediction && (
        <div className="prediction-results">
          <h3>🩺 Prediction Result</h3>
          <p><strong>Risk Level:</strong> {prediction.predicted_risk}</p>
          <p><strong>Confidence:</strong> {prediction.confidence}%</p>
          <h4>🔍 Top Contributing Factors</h4>
          <ul>
            {prediction.shap_values.map(([feature, impact], index) => (
              <li key={index}>
                <strong>{feature}:</strong> {impact.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
