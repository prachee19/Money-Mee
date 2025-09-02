import { Download, LoaderCircle, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard"; // ✅ ensure correct path
import moment from "moment";
import { useState } from "react";

const IncomeList = ({ transactions, onDelete ,onDownload , onEmail }) => {
  const[loading , setLoading] = useState(false);
   
  const handleEmail = async() => {
    setLoading(true);
    try{
      await onEmail();
    }finally{
        setLoading(false);
    }
   }

   const handleDownload = async() => {
    setLoading(true);
     try{
       await onDownload();
    }finally{
        setLoading(false);
    }
   }



  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Incomes</h5>
        <div className="flex items-center justify-end gap-2">
          <button  disabled={loading} className="card-btn flex items-center gap-1" onClick={handleEmail}>
            {loading ? (
              <>
              <LoaderCircle className="w-4 h-4 animate-spin"/>
                  Emailing
              </>

            ) : (
              <>
                <Mail size={15} className="text-base" />Email
              </>
            )}
            
          </button>
          <button   disabled={loading} className="card-btn flex items-center gap-1" onClick={handleDownload}>
            {loading ? (
              <>
              <LoaderCircle className="w-4 h-4 animate-spin"/>
                  Downling
              </>

            ) : (
              <>
                <Download size={15} className="text-base" />Download
              </>
            )}
          </button>
        </div>
      </div>

      {/* Incomes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {transactions?.length > 0 ? (
          transactions.map((income) => (
            <TransactionInfoCard
              key={income.id}
              title={income.name}
              icon={income.icon}
              date={moment(income.date).format("Do MMM YYYY")}
              amount={income.amount}
              type="income"
              onDelete={() => onDelete(income.id)} // ✅ passes id to parent
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No incomes found.</p>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
