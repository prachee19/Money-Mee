import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { addThousandsSeparator } from "../util/util.js"; // Import the formatter

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // ✅ Use "x" (your API sends date in "x")
    const formattedDate = new Date(data.x).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{formattedDate}</p>
        <p className="text-sm text-gray-600 mt-2">
          Total:{" "}
          <span className="font-bold">₹{addThousandsSeparator(data.y)}</span>
        </p>

        {/* ✅ Safe check for details */}
        {Array.isArray(data.details) && data.details.length > 0 && (
          <div className="mt-1">
            <p className="text-sm text-gray-600">Details:</p>
            {data.details.map((detail, index) => (
              <p key={index} className="text-xs text-gray-500 ml-2">
                {detail.name}: ₹{addThousandsSeparator(detail.amount)}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const CustomLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No income data to display for this period.
      </p>
    );
  }

  // ✅ Formatter for the X-axis labels
  const formatDateTick = (tick) => {
    return new Date(tick).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
      >
        {/* --- Gradient fill --- */}
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="x" // ✅ Using correct key
          tickFormatter={formatDateTick}
          axisLine={false}
          tickLine={false}
          style={{ fontSize: "12px" }}
        />

        {/* --- Custom Tooltip --- */}
        <Tooltip content={<CustomTooltip />} />

        {/* --- Area with gradient --- */}
        <Area
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorIncome)"
        />

        <Line
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 8, strokeWidth: 2, fill: "#fff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
