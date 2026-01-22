import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/* ================================
   🔐 ATTACH JWT TOKEN AUTOMATICALLY
   Uses currentUser from localStorage
================================ */
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      // ✅ Token always comes from backend login response
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   🚨 GLOBAL RESPONSE HANDLING
   (Optional but SAFE & useful)
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔒 Auto logout on token expiry / invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
