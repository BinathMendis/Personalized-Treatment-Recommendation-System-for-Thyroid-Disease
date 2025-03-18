import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import axios from "axios";

const App = () => {
  const [extractedData, setExtractedData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [step, setStep] = useState("upload"); // "upload" -> "edit" -> "results"

  // ✅ Receive extracted data and move to the next step
  const handleExtractedData = (data) => {
    console.log("Extracted Data Received in App:", data);
    setExtractedData(data);
    setStep("edit"); // Move to InputForm
  };

  // ✅ Handle form submission for prediction
  const handlePrediction = async (formData) => {
    try {
      console.log("Submitting Form Data:", formData);
      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      setPrediction(response.data);
      setStep("results"); // Move to Results
    } catch (error) {
      console.error("Error predicting risk:", error);
    }
  };

  // ✅ Restart the process (reset everything)
  const handleRestart = () => {
    setExtractedData(null);
    setPrediction(null);
    setStep("upload"); // Back to FileUpload
  };

  return (
    <div className="app">
      <h2>🦋 Thyroid Disease Prediction</h2>

      {/* Step 1: Upload File */}
      {step === "upload" && <FileUpload onExtractedData={handleExtractedData} />}

      {/* Step 2: Edit Data (if extracted) */}
      {step === "edit" && (
        <InputForm
          key={JSON.stringify(extractedData)}
          extractedData={extractedData}
          onSubmit={handlePrediction}
        />
      )}

      {/* Step 3: Show Results */}
      {step === "results" && <Results prediction={prediction} onRestart={handleRestart} />}

      {/* 🔄 Start Over Button (only show after upload) */}
      {step !== "upload" && (
        <button onClick={handleRestart} style={{ marginTop: "10px" }}>
          🔄 Start Over
        </button>
      )}
    </div>
  );
};

export default App;
