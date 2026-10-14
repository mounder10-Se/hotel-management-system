import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <div className="navbar">
      <ul className="nav-links">
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/maintenance">🛠 Maintenance</Link></li>
        <li><Link to="/schedule">📅 Schedule</Link></li>
        <li><Link to="/appointments">📌 Appointments</Link></li>
        <li><Link to="/salaries">💰 Salaries</Link></li>
        <li><Link to="/budget">📊 Budget</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
