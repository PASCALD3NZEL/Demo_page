import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Charts.css";

const UserGrowthChart = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1900 },
    { month: "Mar", users: 2500 },
    { month: "Apr", users: 3100 },
    { month: "May", users: 4200 },
    { month: "Jun", users: 5200 },
    { month: "Jul", users: 6300 },
  ];

  return (
    <div className="chart-card">
      <h4>User Growth</h4>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#246BFD"
            fill="#93C5FD"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
