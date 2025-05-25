import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const InputForm = ({ extractedData, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    Swal.fire({
      title: "Form Submitted!",
      text: "Your data has been successfully submitted for prediction.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#3b82f6",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">📋 Extracted Lab Values</h3>

      <button
        type="button"
        onClick={() => setIsEditable(!isEditable)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isEditable ? "🔒 Lock & Save" : "✏️ Edit Data"}
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            disabled={!isEditable}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditable}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg):</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            disabled={!isEditable}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm):</label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleChange}
            disabled={!isEditable}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">TSH:</label>
          <input
            type="number"
            name="TSH"
            value={formData.TSH}
            onChange={handleChange}
            disabled={!isEditable}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">T3:</label>
          <input
            type="number"
            name="T3"
            value={formData.T3}
            onChange={handleChange}
            disabled={!isEditable}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">T4:</label>
          <input
            type="number"
            name="T4"
            value={formData.T4}
            onChange={handleChange}
            disabled={!isEditable}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isEditable}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          🔍 Predict
        </button>
      </form>
    </div>
  );
};

export default InputForm;