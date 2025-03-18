import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onExtractedData }) => {  // ✅ Correct prop name
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null); // Clear previous errors
  };

  const handleUpload = async () => {
    if (!file) {
      setError("❌ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/extract_lab_values", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Extracted Data:", response.data);
      onExtractedData(response.data);  // ✅ Correct function name
    } catch (error) {
      console.error("Error extracting data:", error);
      setError("❌ Failed to extract data. Please try again.");
    }
  };

  return (
    <div>
      <h3>📂 Upload Lab Report</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>📤 Upload & Extract</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
