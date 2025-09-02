import React, { useState, useEffect } from "react";
import { WalletCards, TrendingUp, TrendingDown } from "lucide-react";
import { addThousandsSeparator } from "../util/util.js";
import { useUser } from "../hooks/useUser.jsx";
import Dashboard from "./Dashboard.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import FinanceOverview from "../components/FinanceOverview.jsx";
import Transactions from "../components/Transactions.jsx";
import SuggestionCard from "../components/SuggestionCard.jsx";


const Home = () => {
  useUser();

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Something went wrong while fetching dashboard data:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {/* Info cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<WalletCards />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-purple-400 "
          />
          <InfoCard
            icon={<TrendingUp />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-green-600"
          />
          <InfoCard
            icon={<TrendingDown />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-600"
          />
        </div>

        {/* Lower grid with charts + transactions */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-6">
          {/* Finance overview chart */}
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <SuggestionCard />

          {/* Expense transactions */}
          <Transactions
            transactions={dashboardData?.recent5Expenses || []}
            onMore={() => navigate("/expense")}
            type="expense"
            title="Recent Expenses"
          />

          {/* Income transactions */}
          <Transactions
            transactions={dashboardData?.recent5Incomes || []}
            onMore={() => navigate("/income")}
            type="income"
            title="Recent Incomes"
          />
        </div>
      </div>
    </Dashboard>
  );
};

export default Home;