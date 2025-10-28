import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import RevenueChart from "../../components/RevenueChart";
import UserGrowthChart from "../../components/UserGrowthChart";
import RecentTransactions from "../../components/RecentTransactions";
import TopPerformers from "../../components/TopPerformers";
import PlatformStats from "../../components/PlatformStats";
import {
  getDashboardStats,
  getRevenueChartData,
  getUserGrowthChartData,
  getRecentTransactions,
  getTopPerformers,
  getPlatformStats
} from "../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: "0",
    activeProjects: "0",
    totalRevenue: "$0",
    growthRate: "0%"
  });
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [platformStats, setPlatformStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          dashboardStats,
          revenueChartData,
          userGrowthChartData,
          recentTxns,
          topPerformersData,
          platformStatsData
        ] = await Promise.all([
          getDashboardStats(),
          getRevenueChartData(),
          getUserGrowthChartData(),
          getRecentTransactions(),
          getTopPerformers(),
          getPlatformStats()
        ]);

        setStats(dashboardStats);
        setRevenueData(revenueChartData);
        setUserGrowthData(userGrowthChartData);
        setRecentTransactions(recentTxns);
        setTopPerformers(topPerformersData);
        setPlatformStats(platformStatsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportReport = () => {
    // Create a printable report
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();

    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SkillBridge Platform Report - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #246BFD; }
            h2 { color: #64748b; margin-top: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; }
            .stat-title { font-weight: bold; font-size: 14px; color: #64748b; }
            .stat-value { font-size: 24px; font-weight: bold; color: #246BFD; margin: 5px 0; }
            .stat-note { font-size: 12px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #e0e0e0; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .section { margin-bottom: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SkillBridge Platform Report</h1>
            <p>Generated on: ${currentDate}</p>
          </div>

          <div class="section">
            <h2>Platform Statistics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-title">Total Users</div>
                <div class="stat-value">${stats.totalUsers}</div>
                <div class="stat-note">↑ 8% from last month</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">Active Projects</div>
                <div class="stat-value">${stats.activeProjects}</div>
                <div class="stat-note">↑ 12% from last month</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">Total Revenue</div>
                <div class="stat-value">${stats.totalRevenue}</div>
                <div class="stat-note">↑ 15% from last month</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">Growth Rate</div>
                <div class="stat-value">${stats.growthRate}</div>
                <div class="stat-note">↑ 4% from last month</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Recent Transactions</h2>
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Client</th>
                  <th>Freelancer</th>
                  <th>Project</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${recentTransactions.map(txn => `
                  <tr>
                    <td>${txn.transactionId}</td>
                    <td>${txn.clientName}</td>
                    <td>${txn.freelancerName}</td>
                    <td>${txn.projectTitle}</td>
                    <td>$${txn.amount}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Top Performers</h2>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Total Earnings</th>
                  <th>Projects</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                ${topPerformers.map(performer => `
                  <tr>
                    <td>${performer.rank}</td>
                    <td>${performer.name}</td>
                    <td>${performer.role}</td>
                    <td>${performer.amount}</td>
                    <td>${performer.projects}</td>
                    <td>${performer.rating}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Platform Statistics</h2>
            <div class="stats-grid">
              ${platformStats.map(stat => `
                <div class="stat-card">
                  <div class="stat-title">${stat.label}</div>
                  <div class="stat-value">${stat.value}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <Header />
          <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div>Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content">
          <div className="overview-row">
            <div className="overview-left">
              <section className="overview-intro">
                <h2>Platform Overview</h2>
                <p className="subtitle">Monitor and manage SkillBridge platform performance.</p>
              </section>

              <div className="stat-cards">
                <StatCard title="Total Users" value={stats.totalUsers} note="↑ 8% from last month" icon="👥" />
                <StatCard title="Active Projects" value={stats.activeProjects} note="↑ 12% from last month" icon="📁" />
                <StatCard title="Total Revenue" value={stats.totalRevenue} note="↑ 15% from last month" icon="💰" />
                <StatCard title="Growth Rate" value={stats.growthRate} note="↑ 4% from last month" icon="📈" />
              </div>

              <div className="charts-row">
                <RevenueChart data={revenueData} />
                <UserGrowthChart data={userGrowthData} />
              </div>
            </div>

            <aside className="overview-right">
              <div className="actions-row">
                <button className="btn-filter" onClick={() => alert("Filter functionality would open here")}>Filter</button>
                <button className="btn-export" onClick={handleExportReport}>Export Report</button>
              </div>

              <TopPerformers data={topPerformers} />
            </aside>
          </div>

          <div className="table-row">
            <RecentTransactions data={recentTransactions} />
            <PlatformStats data={platformStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
