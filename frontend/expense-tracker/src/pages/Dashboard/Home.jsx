import React, { useEffect } from "react";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeperator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import RecentTransactions from './../../components/Dashboard/RecentTransactions';
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "./Last30DaysExpenses";
import RecentIncomeWithChart from "./RecentIncomeWithChart";
import RecentIncome from "./RecentIncome";

const Home = () => {
  // Use user and authLoading state from the hook
  const { user, authLoading } = useUserAuth(); 
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      console.log("Dashboard API Path:", API_PATHS.DASHBOARD.GET_DATA);

      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      console.log("Full API response:", response);

      if (response?.data) {
        console.log("✅ Dashboard data received:", response.data);
        setDashboardData(response.data);
      } else {
        console.warn("⚠️ No data received from the API:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("URL:", error.config?.url);
      } else {
        console.error("Network/config error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🛑 CRITICAL FIX: Fetch data only after authentication is confirmed (not loading and user exists)
    if (!authLoading && user) {
      fetchDashboardData();
    }
    return () => {};
  }, [user, authLoading]); // Dependency array to trigger when auth status changes

  // 🛑 CRITICAL FIX: Render loading state while authentication is being checked
  if (authLoading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center items-center h-screen text-lg font-semibold">
          Loading user session...
        </div>
      </DashboardLayout>
    );
  }

  // Guard against attempting to render the dashboard if the user is not authenticated
  if (!user) {
    return null;
  }
  
  // Optional: Add a simple loading state while data is being fetched (after auth)
  if (!dashboardData && loading) {
     return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="flex justify-center items-center h-screen text-lg font-semibold">
                Fetching financial data...
            </div>
        </DashboardLayout>
    );
  }


  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
          icon={<IoMdCard/>}
          label="Total Balance"
          value={addThousandsSeperator(dashboardData?.totalBalance || 0)}
          color="bg-primary"
          />
          {/* ... other InfoCards ... */}
          <InfoCard
          icon={<LuWalletMinimal/>}
          label="Total Income"
          value={addThousandsSeperator(dashboardData?.totalIncome || 0)}
          color="bg-orange-500"
          />
          <InfoCard
          icon={<LuHandCoins/>}
          label="Total Expense"
          value={addThousandsSeperator(dashboardData?.totalExpense || 0)}
          color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* ... rest of the dashboard components ... */}
          <RecentTransactions 
           transactions={dashboardData?.recentTransactions}
           onSeeMore={()=> navigate("/expense")}
          />
          <FinanceOverview
          totalBalance={dashboardData?.totalBalance||0}
          totalIncome={dashboardData?.totalIncome||0}
          totalExpense={dashboardData?.totalExpense||0}
          />
          <ExpenseTransactions
          transactions={dashboardData?.last30DaysExpenses?.transactions ||[]}
          onSeeMore={()=> navigate("/expense")}
          />
          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions ||[]}
            />
          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) ||[]}
            totalIncome={dashboardData ?.totalIncome || 0}
            />
            <RecentIncome
            transactions={dashboardData?.last60DaysIncome.transactions||[]}
            onSeeMore={()=> navigate("/income")}
            />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;