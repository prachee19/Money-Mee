import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "../pages/Input.jsx";


const AddIncomeForm = ({ onAddIncome  , categories}) => {
  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: "",
     icon: "",
     categoryId: "",
  })

  const categoryOptions = categories.map(category => ({
    value:category.id,
    label:category.name

  }))
  
  
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));
  };

    const handleAddIncome = async () => {
      setLoading(true);
      try{
        await  onAddIncome(income);
      }finally{
        setLoading(false);
      }
    }

    useEffect( ()=>{
      if(categories.length>0 && !income.categoryId){
        setIncome(prev => ({...prev, categoryId:categories[0].id}))
      }
    } , [categories ,income.categoryId]);


  return (
    <div>
      {/* Icon Picker */}
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      {/* Income Source */}
      <Input
        value={income.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Income Source"
        placeholder="e.g., Salary, Freelance, Bonus"
        type="text"
      />

      {/* Income Source */}
      <Input
        value={income.categoryId}
        onChange={({ target }) => handleChange("categoryId", target.value)}
        label="Category"
        isSelect={true}
        options={categoryOptions}
      />

    
      {/* Amount */}
      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="e.g., 500.00"
        type="number"
      />

      {/* Date */}
      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
      />

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddIncome }
          disabled={loading}
          className="add-btn add-btn-fill flex items-center gap-2"
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Income"
          )}
        </button>
      </div>
    </div>
  );
}

export default AddIncomeForm;
