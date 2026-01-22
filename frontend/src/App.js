// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Layout
import Navbar from "./pages/Navbar";

// ✅ CHATBOT
import Chatbot from "./components/chatbot/Chatbot";

// Public pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

// User pages
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ViewComplaints from "./pages/ViewComplaints";

// ✅ ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";

// Static pages
import IPCSection from "./components/ipcSection";
import Child from "./components/Child";
import WomenSafety from "./components/WomenSafety";
import CyberSecurity from "./components/CyberSecurity";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER FROM STORAGE
  ========================= */
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (storedUser && storedUser.token) {
        setCurrentUser(storedUser);
      }
    } catch (err) {
      console.error("Failed to parse stored user");
      localStorage.removeItem("currentUser");
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     LOGIN / LOGOUT
  ========================= */
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  /* =========================
     ROUTE GUARDS
  ========================= */
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Loading...
        </div>
      );
    }

    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const AdminRoute = ({ children }) => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Loading...
        </div>
      );
    }

    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    // 🔐 STRICT ADMIN CHECK
    if (currentUser.role !== "Admin") {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <Router>
      {/* ================= NAVBAR ================= */}
      <Navbar
        isLoggedIn={!!currentUser}
        role={currentUser?.role}
        onLogout={handleLogout}
      />

      {/* ================= ROUTES ================= */}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* USER */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={currentUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewcomplaints"
          element={
            <ProtectedRoute>
              <ViewComplaints currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* STATIC */}
        <Route path="/ipc-section" element={<IPCSection />} />
        <Route path="/child-safety" element={<Child />} />
        <Route path="/women-safety" element={<WomenSafety />} />
        <Route path="/cyber-security" element={<CyberSecurity />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ================= AI CHATBOT (GLOBAL) ================= */}
      <Chatbot />
    </Router>
  );
}

export default App;