import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const FileUpload = ({ onPrediction }) => {
  const [extractedValues, setExtractedValues] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [prediction, setPrediction] = useState(null);

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
      Swal.fire({
        title: "No File Selected",
        text: "Please select a file to upload.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
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

      // Store extracted values in state
      setExtractedValues(extractedData);

      // Stop if extraction fails
      if (!extractedData || Object.keys(extractedData).length === 0) {
        setUploadStatus("⚠️ No valid lab values extracted. Please check the report.");
        Swal.fire({
          title: "No Valid Data",
          text: "No valid lab values were extracted from the report.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#3b82f6",
        });
        return;
      }

      // Prepare data for prediction
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

      // Call /predict API
      const predictResponse = await axios.post(
        "http://127.0.0.1:8000/predict",
        predictionData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setPrediction(predictResponse.data);
      console.log("Prediction Response:", predictResponse.data);

      // Show success alert
      Swal.fire({
        title: "Prediction Successful!",
        text: "Your lab report has been processed and the prediction is ready.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      setUploadStatus("❌ Upload Failed. Try again.");
      Swal.fire({
        title: "Upload Failed",
        text: "There was an error uploading the file. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Navbar */}
      <nav className="bg-blue-600 p-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">🦋 Thyroid Disease Prediction</h1>
          <div className="space-x-4">
            <span className="text-white text-lg">Home</span>
            <span className="text-white text-lg">About</span>
            <span className="text-white text-lg">Contact</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 pt-24"> {/* Added pt-24 to account for the fixed navbar */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">📄 Upload Lab Report</h3>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Upload & Predict
          </button>
          <p className="mt-2 text-sm text-gray-600 text-center">{uploadStatus}</p>

          {/* Display Extracted Lab Values and Prediction Results in Separate Boxes */}
          <div className="mt-6 space-y-6">
            {/* Extracted Lab Values Box */}
            {extractedValues && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-center mb-6">🧪 Extracted Lab Values</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Age:</strong> {extractedValues.age || "Not Detected"}</p>
                  <p><strong>Gender:</strong> {extractedValues.gender || "Not Detected"}</p>
                  <p><strong>Weight:</strong> {extractedValues.weight_kg || "Not Detected"} kg</p>
                  <p><strong>Height:</strong> {extractedValues.height_cm || "Not Detected"} cm</p>
                  <p><strong>TSH:</strong> {extractedValues.tsh !== null ? extractedValues.tsh : "Not Detected"}</p>
                  <p><strong>T3:</strong> {extractedValues.t3 !== null ? extractedValues.t3 : "Not Detected"}</p>
                  <p><strong>T4:</strong> {extractedValues.t4 !== null ? extractedValues.t4 : "Not Detected"}</p>
                </div>
              </div>
            )}

            {/* Prediction Result and Top Contributing Factors Boxes */}
            {prediction && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prediction Result Box */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold mb-4">🩺 Prediction Result</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      <strong>Risk Level:</strong>{" "}
                      <span className="text-green-600 font-semibold">{prediction.predicted_risk}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Confidence:</strong> {prediction.confidence}%
                    </p>
                  </div>
                </div>

                {/* Top Contributing Factors Box */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold mb-4">🔍 Top Contributing Factors</h3>
                  <ul className="list-disc pl-5 text-sm">
                    {prediction.shap_values.map(([feature, impact], index) => (
                      <li key={index}>
                        <strong>{feature}:</strong> {impact.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;