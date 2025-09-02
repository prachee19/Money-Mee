// src/components/ExpenseList.jsx

import { Download, LoaderCircle, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";
import { useState } from "react";

const ExpenseList = ({ transactions, onDelete, onDownload, onEmail }) => {
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    setLoading(true);
    try {
      await onEmail();
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await onDownload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <div className="flex items-center justify-end gap-2">
          <button disabled={loading} className="card-btn flex items-center gap-1" onClick={handleEmail}>
            {loading ? (
              <><LoaderCircle className="w-4 h-4 animate-spin"/> Emailing...</>
            ) : (
              <><Mail size={15} className="text-base" />Email</>
            )}
          </button>
          <button disabled={loading} className="card-btn flex items-center gap-1" onClick={handleDownload}>
             {loading ? (
                <><LoaderCircle className="w-4 h-4 animate-spin"/> Downloading...</>
             ) : (
                <><Download size={15} className="text-base" />Download</>
             )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {transactions?.length > 0 ? (
          transactions.map((expense) => (
            <TransactionInfoCard
              key={expense.id}
              title={expense.name}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense" // Set type to expense
              onDelete={() => onDelete(expense.id)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;