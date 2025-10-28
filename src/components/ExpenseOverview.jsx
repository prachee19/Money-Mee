// src/components/ExpenseOverview.jsx

import { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../util/util.js"; // Note: renamed function
import CustomLineChart from "./CustomLineChart.jsx";
import { Plus } from "lucide-react";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Assuming you have this function in util.js
      const result = prepareExpenseLineChartData(transactions);
      setChartData(result);
    } else {
      setChartData([]);
    }
  }, [transactions]);

  return (
    <div className="card bg-white p-6 rounded-lg shadow-md">
       
      <div className="flex items-center justify-between">
         <div>
            <h5 className="text-xl font-semibold">Expense Overview</h5>
            <p className="text-sm text-gray-500 mt-1">
                Track your spending over time and analyze your expense trends.
            </p>
         </div>
         <div className="flex items-end justify-end">
         <button
                onClick={onAddExpense} // Assuming onAddIncome is your function
                className="
                    bg-gradient-to-r from-purple-400 to-purple-500 
                    text-white 
                    font-bold 
                    py-2 
                    px-4 
                    rounded-lg 
                    shadow-md 
                    hover:shadow-lg 
                    transform 
                    hover:-translate-y-0.5 
                    active:scale-95
                    transition-all 
                    duration-200 
                    ease-in-out 
                    flex 
                    items-center 
                    gap-2
                "
            >
                <Plus size={18} />
                Add Expense
            </button>
        </div>

         
      </div>

      <div className="mt-8 h-80">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;