import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import axios from "axios";

const App = () => {
  const [extractedData, setExtractedData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [step, setStep] = useState("upload"); // Steps: "upload" -> "edit" -> "results"

  // ✅ Receive extracted data and move to the next step
  const handleExtractedData = (data) => {
    console.log("📤 Extracted Data Received in App:", data);

    if (!data) {
      console.error("❌ Error: No extracted values found in response.");
      return;
    }

    setExtractedData(data);
    setStep("edit"); // Move to InputForm
  };

  // ✅ Handle form submission for prediction
  const handlePrediction = async (formData) => {
    try {
      const formattedData = {
        age: formData.age ? Number(formData.age) : 0,
        gender: formData.gender,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : 0,
        height_cm: formData.height_cm ? Number(formData.height_cm) : 0,
        tsh: formData.tsh ? Number(formData.tsh) : 0,
        t3: formData.t3 ? Number(formData.t3) : 0,
        t4: formData.t4 ? Number(formData.t4) : 0,
      };

      console.log("📊 Submitting Form Data:", formattedData);

      const response = await axios.post("http://127.0.0.1:8000/predict", formattedData);

      setPrediction(response.data);
      setStep("results"); // Move to results screen
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">🦋 Thyroid Disease Prediction</h2>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
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
          <button
            onClick={handleRestart}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            🔄 Start Over
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
