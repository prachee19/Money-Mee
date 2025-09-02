import React, { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";

const SuggestionCard = () => {
  const [suggestions, setSuggestions] = useState({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_SPENDING_SUGGESTIONS);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  // Function to determine card color based on type of suggestion
  const getCardColor = (key) => {
    if (key === "Overall") return "bg-red-100 border-red-500";
    else return "bg-yellow-100 border-yellow-500";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Spending Suggestions</h2>
      {Object.keys(suggestions).length === 0 ? (
        <p className="text-green-600">No suggestions! Great job this month.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {Object.entries(suggestions).map(([key, msg], idx) => (
            <div
              key={idx}
              className={`border-l-4 p-3 rounded shadow-sm ${getCardColor(key)}`}
            >
              <strong>{key}:</strong> {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
