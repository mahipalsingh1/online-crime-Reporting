import React from "react";

function CallSupport() {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📞 24×7 Call Support</h3>

      <p style={styles.subText}>
        For immediate help, call one of the support numbers below
      </p>

      {/* 🚨 Emergency */}
      <a href="tel:112" style={{ ...styles.btn, ...styles.emergency }}>
        🚨 Emergency Call (112)
      </a>

      {/* 👮 Police */}
      <a href="tel:100" style={{ ...styles.btn, ...styles.police }}>
        👮 Police Control Room
      </a>

      {/* ☎️ Help Desk */}
      <a href="tel:+919876543210" style={{ ...styles.btn, ...styles.help }}>
        ☎️ CRIMSAFE Help Desk
      </a>

      <p style={styles.note}>
        Available 24×7 • Free Call • Secure
      </p>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #020617, #0f172a)",
    color: "white",
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    animation: "fadeIn 0.6s ease"
  },

  heading: {
    marginBottom: "10px",
    color: "#60a5fa",
    fontSize: "22px"
  },

  subText: {
    fontSize: "14px",
    opacity: 0.9,
    marginBottom: "20px"
  },

  btn: {
    display: "block",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "12px",
    fontSize: "16px",
    textDecoration: "none",
    color: "white",
    fontWeight: "600",
    transition: "transform 0.25s ease, box-shadow 0.25s ease"
  },

  emergency: {
    background: "linear-gradient(135deg, #b91c1c, #dc2626)",
    boxShadow: "0 0 18px rgba(220,38,38,0.7)"
  },

  police: {
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    boxShadow: "0 0 18px rgba(59,130,246,0.7)"
  },

  help: {
    background: "linear-gradient(135deg, #047857, #22c55e)",
    boxShadow: "0 0 18px rgba(34,197,94,0.7)"
  },

  note: {
    marginTop: "10px",
    fontSize: "12px",
    opacity: 0.8
  }
};

export default CallSupport;