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

      console.log("📤 Extracted Data:", response.data);

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
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">📂 Upload Lab Report</h3>

      <input
        type="file"
        onChange={handleFileChange}
        disabled={loading}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-4 w-full py-2 text-white font-semibold rounded-lg transition-all ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "⏳ Extracting..." : "📤 Upload & Extract"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;
