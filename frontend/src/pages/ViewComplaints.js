import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api/axios";

function ViewComplaints({ currentUser }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updateData, setUpdateData] = useState({
    status: "",
    officer: "",
    remarks: ""
  });

  const role = currentUser?.role;
  const username = currentUser?.username;

  const isPublicUser = role === "Public";
  const isPoliceUser = role === "Police";
  const isAdminUser = role === "Admin";

  /* =========================
     FETCH COMPLAINTS
  ========================= */
  useEffect(() => {
    if (!currentUser) return;

    const fetchComplaints = async () => {
      try {
        const res = isPublicUser
          ? await api.get(`/complaints/user/${username}`)
          : await api.get("/complaints/view");

        setComplaints(res.data);
      } catch {
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [currentUser, isPublicUser, username]);

  /* =========================
     UPDATE COMPLAINT
  ========================= */
  const handleUpdate = async (id) => {
    try {
      await api.put(`/complaints/update/${id}`, updateData);
      alert("Complaint updated successfully");
      window.location.reload();
    } catch {
      alert("Update failed");
    }
  };

  /* =========================
     STATUS STYLE
  ========================= */
  const getStatusClass = (status = "Pending") => {
    switch (status) {
      case "Solved": return "status green";
      case "Under Investigation": return "status yellow";
      case "Invalid": return "status red";
      default: return "status gray";
    }
  };

  /* =========================
     EXPORT PDF
  ========================= */
  const exportComplaintAsPDF = (complaint) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Crime Complaint Details", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Complaint ID", complaint._id],
        ["Name", complaint.name],
        ["Mobile", complaint.mobile],
        ["Location", complaint.location],
        ["Crime Type", complaint.crimeType],
        ["IPC Section", complaint.ipcSection],
        ["Description", complaint.detail],
        ["Status", complaint.status],
        ["Officer", complaint.officer || "N/A"],
        ["Remarks", complaint.remarks || "N/A"]
      ]
    });

    doc.save(`Complaint_${complaint._id}.pdf`);
  };

  /* =========================
     MAP URL BUILDER (FREE)
  ========================= */
  const getMapURL = (c) => {
    if (c.latitude && c.longitude) {
      return `https://maps.google.com/maps?q=${c.latitude},${c.longitude}&z=14&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(c.location || "India")}&z=13&output=embed`;
  };

  return (
    <div className="container">
      <style>{`
        .container {
          min-height: 100vh;
          padding: 30px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          font-family: Arial;
        }
        h2 {
          color: white;
          text-align: center;
          margin-bottom: 20px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 14px;
          margin-bottom: 25px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 8px 25px rgba(0,0,0,0.25);
          animation: fadeUp 0.4s ease;
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(15px); }
          to { opacity:1; transform:translateY(0); }
        }
        .status {
          padding: 4px 12px;
          border-radius: 14px;
          color: white;
          font-weight: bold;
        }
        .green { background:#38a169; }
        .yellow { background:#d69e2e; }
        .red { background:#e53e3e; }
        .gray { background:#718096; }

        iframe {
          width: 100%;
          height: 220px;
          border-radius: 12px;
          margin-top: 12px;
          border: 1px solid #ccc;
        }

        select, input, textarea {
          width: 100%;
          margin-top: 8px;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        button {
          margin-top: 10px;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #003366;
          color: white;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          background: #00509e;
        }

        .error {
          color: white;
          text-align: center;
        }
      `}</style>

      <h2>{isPublicUser ? "My Complaints" : "All Complaints"}</h2>

      {loading && <p className="error">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {complaints.map((c) => (
        <div key={c._id} className="card">
          <p><b>Complaint ID:</b> {c._id}</p>
          <p><b>Name:</b> {c.name}</p>
          <p><b>Crime:</b> {c.crimeType}</p>
          <p>
            <b>Status:</b>{" "}
            <span className={getStatusClass(c.status)}>
              {c.status}
            </span>
          </p>

          {/* 🗺️ MAP VIEW */}
          <iframe
            src={getMapURL(c)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* PUBLIC */}
          {isPublicUser && (
            <button onClick={() => exportComplaintAsPDF(c)}>
              Export PDF
            </button>
          )}

          {/* POLICE / ADMIN */}
          {(isPoliceUser || isAdminUser) && (
            <>
              <select onChange={(e) =>
                setUpdateData({ ...updateData, status: e.target.value })}
              >
                <option value="">Select Status</option>
                <option>Pending</option>
                <option>Under Investigation</option>
                <option>Solved</option>
                <option>Invalid</option>
              </select>

              <input
                placeholder="Officer Name"
                onChange={(e) =>
                  setUpdateData({ ...updateData, officer: e.target.value })}
              />

              <textarea
                placeholder="Remarks"
                onChange={(e) =>
                  setUpdateData({ ...updateData, remarks: e.target.value })}
              />

              <button onClick={() => handleUpdate(c._id)}>
                Update Complaint
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewComplaints;