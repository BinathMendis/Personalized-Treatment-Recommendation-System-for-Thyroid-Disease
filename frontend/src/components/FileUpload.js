import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onExtractedData }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Added loading state

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
    setLoading(true); // ✅ Start loading

    try {
      const response = await axios.post("http://127.0.0.1:8000/extract_lab_values", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Extracted Data:", response.data);

      if (response.data?.extracted_values) {
        onExtractedData(response.data.extracted_values); // ✅ Send extracted values
        setFile(null); // ✅ Reset file input after upload
      } else {
        setError("❌ Extraction failed. No data found.");
      }
    } catch (error) {
      console.error("Error extracting data:", error);
      setError("❌ Failed to extract data. Please try again.");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div>
      <h3>📂 Upload Lab Report</h3>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "⏳ Extracting..." : "📤 Upload & Extract"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
