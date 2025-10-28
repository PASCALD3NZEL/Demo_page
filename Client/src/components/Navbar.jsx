import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="skill">Skill</span>
        <span className="bridge">Bridge</span>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/admin">Admin</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>

        <Link to="/register">
          <button className="join-btn">Join Now</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
