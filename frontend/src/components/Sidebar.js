import React from "react";
import { useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = ({
  activeSection,
  onDashboard,
  onTransactions,
  onAddTransaction,
  onAnalytics,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="spendwise-sidebar">
      <div className="sidebar-menu">
        <div className="sidebar-section-title">
          MENU
        </div>

        {/* Dashboard */}
        <button
          type="button"
          className={`sidebar-item ${
            activeSection === "dashboard"
              ? "sidebar-item-active"
              : ""
          }`}
          onClick={onDashboard}
        >
          <span className="sidebar-icon">
            <DashboardIcon />
          </span>

          <span>Dashboard</span>
        </button>

        {/* Transactions */}
        <button
          type="button"
          className={`sidebar-item ${
            activeSection === "transactions"
              ? "sidebar-item-active"
              : ""
          }`}
          onClick={onTransactions}
        >
          <span className="sidebar-icon">
            <ReceiptLongIcon />
          </span>

          <span>Transactions</span>
        </button>

        {/* Add Transaction */}
        <button
          type="button"
          className="sidebar-item"
          onClick={onAddTransaction}
        >
          <span className="sidebar-icon">
            <AddCircleOutlineIcon />
          </span>

          <span>Add Transaction</span>
        </button>

        {/* Analytics */}
        <button
          type="button"
          className={`sidebar-item ${
            activeSection === "analytics"
              ? "sidebar-item-active"
              : ""
          }`}
          onClick={onAnalytics}
        >
          <span className="sidebar-icon">
            <BarChartIcon />
          </span>

          <span>Analytics</span>
        </button>
      </div>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-item sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            <LogoutIcon />
          </span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;