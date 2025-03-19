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
        age: extractedData.age ?? "", // Convert `null` to empty string
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
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">📋 Extracted Lab Values</h3>

      {/* Edit Button */}
      <button
        type="button"
        onClick={() => setIsEditable(!isEditable)}
        className="mb-4 px-4 py-2 rounded-md text-white font-semibold transition-all 
                   bg-blue-500 hover:bg-blue-600 focus:outline-none"
      >
        {isEditable ? "🔒 Lock & Save" : "✏️ Edit Data"}
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Fields */}
        {[
          { label: "Age", name: "age", type: "number" },
          { label: "Weight (kg)", name: "weight_kg", type: "number" },
          { label: "Height (cm)", name: "height_cm", type: "number" },
          { label: "TSH", name: "tsh", type: "number" },
          { label: "T3", name: "t3", type: "number" },
          { label: "T4", name: "t4", type: "number" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-gray-600 font-medium">{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={!isEditable}
              className="w-full px-3 py-2 border rounded-md focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        ))}

        {/* Gender Selection */}
        <div>
          <label className="block text-gray-600 font-medium">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditable}
            className="w-full px-3 py-2 border rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isEditable}
          className={`w-full px-4 py-2 font-semibold rounded-md transition-all ${
            isEditable ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          🔍 Save & Predict
        </button>
      </form>
    </div>
  );
};

export default InputForm;
