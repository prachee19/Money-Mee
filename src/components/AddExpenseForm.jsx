// src/components/AddExpenseForm.jsx
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "../pages/Input.jsx";

const AddExpenseForm = ({ onAddExpense, categories, isSubmitting }) => {
  const [expense, setExpense] = useState({
    name: "",
    categoryId: "",
    amount: "",
    date: "",
    icon: "",
  });

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleChange = (key, value) => {
    setExpense((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddExpense = () => {
    onAddExpense(expense);
  };

  // ✅ Preselect first category if available
  useEffect(() => {
    if (categories.length > 0 && !expense.categoryId) {
      setExpense((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, expense.categoryId]);

  return (
    <div>
      {/* Icon Picker */}
      <EmojiPickerPopup
        selectedEmoji={expense.icon}
        onEmojiSelect={(emoji) => handleChange("icon", emoji.native)}
      />

      {/* Expense Name */}
      <Input
        label="Expense Source"
        placeholder="e.g., Rent, Food, Travel"
        value={expense.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={expense.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <Input
        label="Amount"
        type="number"
        placeholder="e.g., 500.00"
        value={expense.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
      />

      {/* Date */}
      <Input
        label="Date"
        type="date"
        value={expense.date}
        onChange={(e) => handleChange("date", e.target.value)}
      />

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddExpense}
          disabled={isSubmitting}
          className="add-btn add-btn-fill flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Expense"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
