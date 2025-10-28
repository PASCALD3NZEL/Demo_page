import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Charts.css";

const RevenueChart = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { month: "Jan", revenue: 4000, transactions: 2400 },
    { month: "Feb", revenue: 3000, transactions: 1398 },
    { month: "Mar", revenue: 5000, transactions: 9800 },
    { month: "Apr", revenue: 4780, transactions: 3908 },
    { month: "May", revenue: 5890, transactions: 4800 },
    { month: "Jun", revenue: 7390, transactions: 3800 },
    { month: "Jul", revenue: 6490, transactions: 4300 },
  ];

  return (
    <div className="chart-card">
      <h4>Revenue & Transactions</h4>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#246BFD" strokeWidth={3} />
          <Line type="monotone" dataKey="transactions" stroke="#34D399" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
