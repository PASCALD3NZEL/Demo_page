import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sb">
      <div className="sb-top">
        <div className="sb-logo">SkillBridge</div>
      </div>

      <nav className="sb-nav">
        <ul>
          <li
            className={location.pathname === "/admin" ? "active" : ""}
            onClick={() => handleNavigation("/admin")}
          >
            <span className="icon">🏠</span> Dashboard
          </li>
          <li
            className={location.pathname === "/admin/users" ? "active" : ""}
            onClick={() => handleNavigation("/admin/users")}
          >
            <span className="icon">👥</span> Users
          </li>
          <li
            className={location.pathname === "/admin/projects" ? "active" : ""}
            onClick={() => handleNavigation("/admin/projects")}
          >
            <span className="icon">📁</span> Projects
          </li>
          <li
            className={location.pathname === "/admin/transactions" ? "active" : ""}
            onClick={() => handleNavigation("/admin/transactions")}
          >
            <span className="icon">💳</span> Transactions
          </li>
          <li
            className={location.pathname === "/admin/analytics" ? "active" : ""}
            onClick={() => handleNavigation("/admin/analytics")}
          >
            <span className="icon">📊</span> Analytics
          </li>
          <li
            className={location.pathname === "/admin/settings" ? "active" : ""}
            onClick={() => handleNavigation("/admin/settings")}
          >
            <span className="icon">⚙️</span> Settings
          </li>
        </ul>
      </nav>

      <div className="sb-footer">
        <div className="avatar">AU</div>
        <div className="admin-info">
          <div className="admin-name">Admin User</div>
          <div className="admin-role">Admin</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
