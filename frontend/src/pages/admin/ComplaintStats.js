import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import "./ComplaintStats.css";

/* ===============================
   CHART REGISTRATION
================================ */
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function ComplaintStats({ complaints = [] }) {

  /* ===============================
     STATUS CALCULATION
  ================================ */
  const statusCount = {
    Pending: 0,
    "Under Investigation": 0,
    Solved: 0,
    Invalid: 0
  };

  complaints.forEach(c => {
    if (statusCount[c.status] !== undefined) {
      statusCount[c.status]++;
    }
  });

  /* ===============================
     PIE CHART DATA
  ================================ */
  const pieData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: [
          "#facc15", // Pending - Yellow
          "#3b82f6", // Investigation - Blue
          "#22c55e", // Solved - Green
          "#ef4444"  // Invalid - Red
        ],
        borderColor: "#020617",
        borderWidth: 2,
        hoverOffset: 18
      }
    ]
  };

  /* ===============================
     BAR CHART DATA
  ================================ */
  const barData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        label: "Number of Complaints",
        data: Object.values(statusCount),
        backgroundColor: [
          "#fde047",
          "#60a5fa",
          "#4ade80",
          "#f87171"
        ],
        borderRadius: 10,
        barThickness: 50
      }
    ]
  };

  /* ===============================
     OPTIONS (ANIMATION + STYLE)
  ================================ */
  const commonOptions = {
    responsive: true,
    animation: {
      duration: 1400,
      easing: "easeOutQuart"
    },
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 13 }
        }
      }
    }
  };

  return (
    <div className="stats-graph-wrapper">

      {/* ================= PIE ================= */}
      <div className="graph-card glow-blue">
        <h3>Complaint Status Distribution</h3>
        <Pie data={pieData} options={commonOptions} />
      </div>

      {/* ================= BAR ================= */}
      <div className="graph-card glow-green">
        <h3>Status Comparison</h3>
        <Bar data={barData} options={commonOptions} />
      </div>

    </div>
  );
}

export default ComplaintStats;