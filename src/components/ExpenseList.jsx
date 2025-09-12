// src/components/ExpenseList.jsx

import { Download, LoaderCircle, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";


const ExpenseList = ({ transactions, onDelete, onDownload, onEmail, isDownloading, isEmailing }) => {


  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <div className="flex items-center justify-end gap-2">

          <button
            // Use the new props for disabled state
            disabled={isDownloading || isEmailing}
            className="card-btn flex items-center gap-1"
            // Use the onEmail prop directly
            onClick={onEmail}
          >
            {/* Use the isEmailing prop for the condition */}
            {isEmailing ? (
              <><LoaderCircle className="w-4 h-4 animate-spin"/> Emailing...</>
            ) : (
              <><Mail size={15} className="text-base" />Email</>
            )}
          </button>
          
       
          <button
            // Use the new props for disabled state
            disabled={isDownloading || isEmailing}
            className="card-btn flex items-center gap-1"
            // Use the onDownload prop directly
            onClick={onDownload}
          >
            {/* Use the isDownloading prop for the condition */}
            {isDownloading ? (
              <><LoaderCircle className="w-4 h-4 animate-spin"/> Downloading...</>
            ) : (
              <><Download size={15} className="text-base" />Download</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md-grid-cols-2 gap-4 mt-4">
        {transactions?.length > 0 ? (
          transactions.map((expense) => (
            <TransactionInfoCard
              key={expense.id}
              title={expense.name}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
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
