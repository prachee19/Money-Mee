export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  // Convert number to string to handle decimals
  const numStr = num.toString();
  const parts = numStr.split("."); // Split into integer and fractional parts

  let integerPart= parts[0];
  let fractionalPart= parts[1];

  // Regex for Indian numbering system
  // It handles the first three digits, then every two digits
  const lastThree= integerPart.substring(integerPart.length - 3);
  const otherNumbers= integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== "") {
    // Apply comma after every two digits for the 'otherNumbers' part
    const formattedOtherNumbers = otherNumbers.replace(
      /\B(?=(\d{2})+(?!\d))/g,
      ","
    );
    integerPart = formattedOtherNumbers + "," + lastThree;
  } else {
    integerPart = lastThree; // No change if less than 4 digits
  }

  // Combine integer and fractional parts
  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
};

// /src/util/util.js



// ✅ Expense chart data preparation
export const prepareExpenseLineChartData = (expenses) => {
  if (!expenses) return [];

  // Sort expenses by date
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Group by date
  const groupedData = sortedExpenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = {
        date: date,
        total: 0,
        details: []
      };
    }
    acc[date].total += expense.amount;
    acc[date].details.push({ name: expense.name, amount: expense.amount });
    return acc;
  }, {});

  // Convert grouped object to array
  return Object.values(groupedData).map(item => ({
    x: item.date,   // for X-axis
    y: item.total,  // for Y-axis (sum)
    ...item         // includes date, total, details for tooltip
  }));
};


export const prepareIncomeLineChartData = (incomes) => {
  if (!incomes) return [];
  // Sort incomes by date to ensure the line chart connects points in the correct order
  const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Group transactions by date
  const groupedData = sortedIncomes.reduce((acc, income) => {
    const date = income.date;
    if (!acc[date]) {
      acc[date] = {
        date: date,
        total: 0,
        details: []
      };
    }
    acc[date].total += income.amount;
    acc[date].details.push({ name: income.name, amount: income.amount });
    return acc;
  }, {});

  // Map to the format recharts needs
  return Object.values(groupedData).map(item => ({
    x: item.date, // for the axis
    y: item.total, // for the line/area position
    ...item // Pass all other data for the tooltip
  }));
};

