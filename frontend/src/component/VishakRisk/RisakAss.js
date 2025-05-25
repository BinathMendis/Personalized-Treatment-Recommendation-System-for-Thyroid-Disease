import React, { useState } from "react";
import FileUpload from "./FileUpload";
import InputForm from "./InputForm";
import Results from "./Results";
import axios from "axios";

const RiskAss = () => {
  const [extractedData, setExtractedData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleExtractedData = (data) => {
    console.log("Extracted Data Received in App:", data);
    setExtractedData(data);
  };

  const handlePrediction = async (formData) => {
    try {
      console.log("Submitting Form Data:", formData);
      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error predicting risk:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <FileUpload onExtractedData={handleExtractedData} />
        {extractedData && <InputForm key={JSON.stringify(extractedData)} extractedData={extractedData} onSubmit={handlePrediction} />}
        {prediction && <Results prediction={prediction} />}
      </div>
    </div>
  );
};

export default RiskAss;