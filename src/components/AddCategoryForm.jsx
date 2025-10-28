import { useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Input from "../pages/Input.jsx"; 
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";

const AddCategoryForm = ({ onSuccess, onClose, existingCategories = [] }) => {
  const [category, setCategory] = useState({
    name: "",
    type: "income",
    icon: ""
  });

  const [loading, setLoading] = useState(false);

  const categoryTypeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" }
  ];

  const handleChange = (key, value) => {
    setCategory({ ...category, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name.trim()) {
      toast.error("Category name is required!");
      return;
    }

    // ✅ Duplicate check
    const isDuplicate = existingCategories.some(
      (c) => c.name.toLowerCase() === category.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Category name already exists!");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosConfig.post(
        API_ENDPOINTS.ADD_CATEGORY,
        category
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Category added successfully!");
        if (onSuccess) onSuccess(); // refresh parent list
        if (onClose) onClose();     // close modal
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit}>
      {/* ✅ Emoji Picker for category icon */}
      <EmojiPickerPopup
        icon={category.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      {/* Category Name */}
      <Input
        value={category.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Category Name"
        placeholder="e.g., Freelance, Salary, Groceries"
        type="text"
      />

      {/* Category Type (Income/Expense) */}
      <Input
        label="Category Type"
        value={category.type}
        onChange={({ target }) => handleChange("type", target.value)}
        isSelect={true}
        options={categoryTypeOptions}
      />

      {/* Submit button */}
      <button
        type="submit"
        className="add-btn px-4 py-2 rounded-md text-white bg-blue-500 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
};

export default AddCategoryForm;

