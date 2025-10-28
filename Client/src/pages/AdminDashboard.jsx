import React from "react";
import "./AdminDashboard.css";
import RevenueChart from "../components/RevenueChart";
import UserGrowthChart from "../components/UserGrowthChart";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="logo">SkillBridge</h2>
        <ul className="nav-links">
          <li className="active">🏠 Dashboard</li>
          <li>👥 Users</li>
          <li>📁 Projects</li>
          <li>💳 Transactions</li>
          <li>📊 Analytics</li>
          <li>⚙️ Settings</li>
        </ul>
        <div className="admin-footer">
          <div className="avatar">AU</div>
          <div>
            <p>Admin User</p>
            <small>Admin</small>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h3>Platform Overview</h3>
          <div className="actions">
            <button className="filter-btn">Filter</button>
            <button className="export-btn">Export Report</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">Total Users<br /><b>12,543</b></div>
          <div className="stat-card">Active Projects<br /><b>1,284</b></div>
          <div className="stat-card">Total Revenue<br /><b>$284,540</b></div>
          <div className="stat-card">Growth Rate<br /><b>24%</b></div>
        </div>

        <div className="charts-section">
          <RevenueChart />
          <UserGrowthChart />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
