import React, { useState } from "react";

const FileUpload = ({ onExtracted }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first.");
      return;
    }

    setMessage("📂 Uploading...");

    // Simulating OCR extraction (Replace with API call)
    setTimeout(() => {
      const extractedData = {
        age: 45,
        gender: "Male",
        weight: "Not Detected",
        height: "Not Detected",
        TSH: 3.2,
        T3: 1.6,
        T4: 1.2,
      };

      setMessage("✅ Extraction Successful!");
      onExtracted(extractedData); // Send extracted data to parent (App.js)
    }, 1500);
  };

  return (
    <div>
      <h3>📤 Upload Lab Report</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>📄 Upload & Extract</button>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
