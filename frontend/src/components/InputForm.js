import React, { useState, useEffect } from "react";

const InputForm = ({ extractedData, onSubmit }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    weight_kg: "",
    height_cm: "",
    tsh: "",
    t3: "",
    t4: "",
  });

  const [isEditable, setIsEditable] = useState(false); // Controls edit mode

  // ✅ Ensure extracted values are mapped properly (fixing missing data)
  useEffect(() => {
    if (extractedData) {
      setFormData({
        age: extractedData.age ?? "",  // Convert `null` to empty string
        gender: extractedData.gender || "Male",
        weight_kg: extractedData.weight_kg ?? "",
        height_cm: extractedData.height_cm ?? "",
        tsh: extractedData.tsh ?? "",
        t3: extractedData.t3 ?? "",
        t4: extractedData.t4 ?? "",
      });
    }
  }, [extractedData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Convert empty strings to `null` or numbers before submitting
    const formattedData = {
      age: formData.age ? Number(formData.age) : 0,
      gender: formData.gender,
      weight_kg: formData.weight_kg ? Number(formData.weight_kg) : 0,
      height_cm: formData.height_cm ? Number(formData.height_cm) : 0,
      tsh: formData.tsh ? Number(formData.tsh) : 0,
      t3: formData.t3 ? Number(formData.t3) : 0,
      t4: formData.t4 ? Number(formData.t4) : 0,
    };

    console.log("✅ Submitting modified values:", formattedData);
    onSubmit(formattedData);
  };

  return (
    <div>
      <h3>📋 Extracted Lab Values</h3>

      {/* Edit Button */}
      <button
        type="button"
        onClick={() => setIsEditable(!isEditable)}
        style={{ marginBottom: "10px" }}
      >
        {isEditable ? "🔒 Lock & Save" : "✏️ Edit Data"}
      </button>

      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          disabled={!isEditable}
        />

        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={!isEditable}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Weight (kg):</label>
        <input
          type="number"
          name="weight_kg"
          value={formData.weight_kg}
          onChange={handleChange}
          disabled={!isEditable}
        />

        <label>Height (cm):</label>
        <input
          type="number"
          name="height_cm"
          value={formData.height_cm}
          onChange={handleChange}
          disabled={!isEditable}
        />

        <label>TSH:</label>
        <input
          type="number"
          name="tsh"
          value={formData.tsh}
          onChange={handleChange}
          disabled={!isEditable}
        />

        <label>T3:</label>
        <input
          type="number"
          name="t3"
          value={formData.t3}
          onChange={handleChange}
          disabled={!isEditable}
        />

        <label>T4:</label>
        <input
          type="number"
          name="t4"
          value={formData.t4}
          onChange={handleChange}
          disabled={!isEditable}
        />

        <button type="submit" disabled={isEditable}>
          🔍 Save & Predict
        </button>
      </form>
    </div>
  );
};

export default InputForm;
