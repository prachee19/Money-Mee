import React from "react";
import moment from "moment";
import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";

const Transactions = ({ transactions, onMore, type, title }) => {
  return (
    <div className="card">
      {/* Header with title and button */}
      <div className="flex items-center justify-between">
        <h5 className="text-lg">{title}</h5>
        <button
          className="card-btn flex items-center gap-1"
          onClick={onMore}
        >
          More <ArrowRight className="text-base" size={15} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="mt-6">
        {transactions?.length ? (
          transactions.slice(0, 5).map((item) => (
            <TransactionInfoCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              date={moment(item.date).format("Do MMM YYYY")}
              amount={item.amount}
              type={type}
              hideDeleteBtn
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No transactions available</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
