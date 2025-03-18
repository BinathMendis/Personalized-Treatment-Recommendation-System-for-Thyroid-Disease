import React, { useState, useEffect } from "react";

const InputForm = ({ extractedData, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false); // Controls edit mode

  // Load extracted data into form state
  useEffect(() => {
    if (extractedData) {
      setFormData({
        age: extractedData.age || "",
        gender: extractedData.gender || "",
        weight: extractedData.weight || "Not Detected",
        height: extractedData.height || "Not Detected",
        TSH: extractedData.TSH || "",
        T3: extractedData.T3 || "",
        T4: extractedData.T4 || "",
      });
    }
  }, [extractedData]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="input-form">
      <h3>📋 Extracted Lab Values</h3>

      {/* Edit Button */}
      <button type="button" onClick={() => setIsEditable(!isEditable)} style={{ marginBottom: "10px" }}>
        {isEditable ? "🔒 Lock & Save" : "✏️ Edit Data"}
      </button>

      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} disabled={!isEditable} />

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditable}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Weight (kg):</label>
        <input type="text" name="weight" value={formData.weight} onChange={handleChange} disabled={!isEditable} />

        <label>Height (cm):</label>
        <input type="text" name="height" value={formData.height} onChange={handleChange} disabled={!isEditable} />

        <label>TSH:</label>
        <input type="number" name="TSH" value={formData.TSH} onChange={handleChange} disabled={!isEditable} />

        <label>T3:</label>
        <input type="number" name="T3" value={formData.T3} onChange={handleChange} disabled={!isEditable} />

        <label>T4:</label>
        <input type="number" name="T4" value={formData.T4} onChange={handleChange} disabled={!isEditable} />

        <button type="submit" disabled={isEditable}>🔍 Predict</button>
      </form>
    </div>
  );
};

export default InputForm;
