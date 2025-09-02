import { useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";

const EditCategoryForm = ({ category, onSuccess, onClose, existingCategories = [] }) => {
  const [name, setName] = useState(category?.name || "");
  const [type, setType] = useState(category?.type || "income");

  const categoryTypeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required!");
      return;
    }

    // ✅ Duplicate check (ignore current category id)
    const isDuplicate = existingCategories.some(
      (c) =>
        c.id !== category.id &&
        c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Category name already exists!");
      return;
    }

    try {
      const response = await axiosConfig.put(
        `${API_ENDPOINTS.UPDATE_CATEGORY}/${category.id}`,
        { name, type }
      );
      if (response.status === 200) {
        toast.success("Category updated successfully!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Category Name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="border rounded p-2"
        required
      />

      {/* ✅ Category Type Dropdown */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded p-2"
        required
      >
        {categoryTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditCategoryForm;
