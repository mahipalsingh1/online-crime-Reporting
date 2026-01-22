// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Public"); // UI only
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, role: backendRole, user } = res.data;

      // ✅ Normalize role (backend sends lowercase)
      const normalizedRole =
        backendRole.charAt(0).toUpperCase() + backendRole.slice(1);

      // ✅ STORE FULL USER OBJECT FROM BACKEND (FIXES PROFILE)
      const userData = {
        ...user,            // name, dob, gender, mobile, email, username
        role: normalizedRole,
        token
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      onLogin(userData);

      alert("Login successful");

      // ✅ Role-based navigation
      if (normalizedRole === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <style>{`
        .rainbow-bg {
          background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1, #84fab0, #8fd3f4);
          background-size: 600% 600%;
          animation: gradientMove 15s ease infinite;
          min-height: 100vh;
          padding: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        .login-box {
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
          width: 320px;
          text-align: center;
        }

        .login-box h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .login-box input, .login-box select {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #aaa;
          border-radius: 5px;
        }

        .login-box button {
          background-color: #4caf50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .login-box button:hover {
          background-color: #388e3c;
        }
      `}</style>

      <div className="rainbow-bg">
        <div className="login-box">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            {/* ✅ FIX: Admin does NOT require email validation */}
            <input
              type={role === "Admin" ? "text" : "email"}
              placeholder={role === "Admin" ? "Admin ID" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* UI only – backend decides actual role */}
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Public">Public</option>
              <option value="Police">Police</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;