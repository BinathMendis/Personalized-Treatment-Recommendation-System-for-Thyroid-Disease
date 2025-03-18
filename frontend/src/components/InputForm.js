import React, { useState, useEffect } from "react";

const InputForm = ({ extractedData, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false); // Controls edit mode

  useEffect(() => {
    setFormData(extractedData);
  }, [extractedData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
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

        <button type="submit" disabled={isEditable}>🔍 Save & Predict</button>
      </form>
    </div>
  );
};

export default InputForm;
