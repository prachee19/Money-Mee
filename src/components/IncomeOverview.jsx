// src/components/IncomeOverview.jsx

import { useEffect, useState } from "react";
import { prepareIncomeLineChartData } from "../util/util.js";
import CustomLineChart from "./CustomLineChart.jsx";
import { Plus } from "lucide-react";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const result = prepareIncomeLineChartData(transactions);
      setChartData(result);
    } else {
      setChartData([]);
    }
  }, [transactions]);

  return (
    <div className="card bg-white p-6 rounded-lg shadow-md">
      {/* --- MODIFIED JSX STRUCTURE --- */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-xl font-semibold">Income Overview</h5>
          <p className="text-sm text-gray-500 mt-1">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        <button
          onClick={onAddIncome}
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
          Add Income
        </button>
      </div>

      {/* This div is the container for the chart */}
      <div className="mt-8 h-80">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverview;