import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, note, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-title">{title}</div>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  );
};

export default StatCard;