import React from "react";
import { NavLink } from "react-router-dom";
import NotificationBell from "../components/NotificationBell"; // 🔔 IMPORT
import "./Navbar.css";

function Navbar({ isLoggedIn, role, onLogout }) {
  return (
    <nav className="navbar">
      {/* ================= LEFT ================= */}
      <h2>Online Crime Reporting System (CRIMSAFE)</h2>

      {/* ================= RIGHT ================= */}
      <div className="nav-links">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>

        {/* 🔴 24×7 CALL SUPPORT */}
        <a
          href="tel:9024383761"
          className="nav-item emergency-call"
          title="24×7 Emergency Call Support"
        >
          📞 <span className="call-text">24×7 Call</span>
          <strong className="call-number">9024383761</strong>
        </a>

        {/* 🔔 NOTIFICATION BELL (LOGIN REQUIRED) */}
        {isLoggedIn && <NotificationBell />}

        {isLoggedIn ? (
          <>
            {/* 🔐 ADMIN ONLY */}
            {role === "Admin" && (
              <NavLink to="/admin" className="nav-item">
                Admin Dashboard
              </NavLink>
            )}

            {/* 👮 PUBLIC / POLICE */}
            {role !== "Admin" && (
              <>
                <NavLink to="/dashboard" className="nav-item">
                  Dashboard
                </NavLink>

                <NavLink to="/viewcomplaints" className="nav-item">
                  View Complaints
                </NavLink>
              </>
            )}

            {/* 👤 COMMON */}
            <NavLink to="/profile" className="nav-item">
              Profile
            </NavLink>

            <button
              type="button"
              className="logout-btn"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/signup" className="nav-item">
              Sign Up
            </NavLink>

            <NavLink to="/login" className="nav-item">
              Login
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;