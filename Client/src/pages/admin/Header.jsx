import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="back-btn" onClick={handleBack}>← Back to Selection</button>
      </div>
      <div className="header-right">
        <input className="search" placeholder="Search..." />
        <div className="profile">AU</div>
      </div>
    </header>
  );
};

export default Header;