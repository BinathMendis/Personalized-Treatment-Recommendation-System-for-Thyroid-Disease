import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import axios from "axios";

const App = () => {
  const [extractedData, setExtractedData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Receive extracted data
  const handleExtractedData = (data) => {
    console.log("Extracted Data Received in App:", data);
    setExtractedData(data);
  };  

  // Handle form submission for prediction
  const handlePrediction = async (formData) => {
    try {
      console.log("Submitting Form Data:", formData); // Debugging: Check if form submits correctly
      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error predicting risk:", error);
    }
  };

  return (
    <div className="app">
      <h2>🦋 Thyroid Disease Prediction</h2>
      <FileUpload onExtractedData={handleExtractedData} />
      
      {/* Show editable form only if extractedData is available */}
      {extractedData && <InputForm key={JSON.stringify(extractedData)} extractedData={extractedData} onSubmit={handlePrediction} />}
      
      {/* Show results only after prediction */}
      {prediction && <Results prediction={prediction} />}
    </div>
  );
};

export default App;
