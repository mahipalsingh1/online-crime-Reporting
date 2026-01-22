import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";

/* =========================
   IPC MAPPING
========================= */
const crimeIpcMapping = {
  "Chain Snatching": "IPC Section 356",
  "Pickpocketing": "IPC Section 379",
  "Mobile Theft": "IPC Section 379",
  "Vehicle Theft": "IPC Section 379",
  "House Burglary": "IPC Section 457 and 380",
  "ATM Fraud": "IPC Section 420 and IT Act Section 66",
  "Online Scam": "IPC Section 420 and IT Act Section 66D",
  "Cyber Bullying": "IT Act Section 66A",
  "Fake Job Scam": "IPC Section 420",
  "Domestic Violence": "Protection of Women from Domestic Violence Act, 2005",
  "Sexual Harassment": "IPC Section 354A",
  "Kidnapping": "IPC Section 363",
  "Dowry Harassment": "IPC Section 498A",
  "Murder": "IPC Section 302",
  "Attempt to Murder": "IPC Section 307",
  "Assault": "IPC Section 351",
  "Robbery": "IPC Section 392",
  "Drug Trafficking": "NDPS Act, 1985 Section 21",
  "Child Abuse": "POCSO Act, 2012 Section 7 and 9",
  "Human Trafficking": "IPC Section 370",
  "Acid Attack": "IPC Section 326A",
  "Public Nuisance": "IPC Section 268",
  "Cyber Hacking": "IT Act Section 66",
  "Identity Theft": "IT Act Section 66C",
  "Credit Card Fraud": "IT Act Section 66C and 66D"
};

function Dashboard({ user }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    crimeType: '',
    ipcSection: '',
    detail: '',
    evidence: '',
    date: '',
    mobile: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    let updated = {
      ...form,
      [name]: name === "evidence" ? files?.[0]?.name || "" : value
    };

    if (name === "crimeType") {
      updated.ipcSection = crimeIpcMapping[value] || "";
    }

    setForm(updated);
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      setError("Enter valid 10-digit mobile number");
      return;
    }

    if (!form.name || !form.location || !form.detail) {
      setError("All required fields must be filled");
      return;
    }

    try {
      setLoading(true);

      await api.post("/complaints/register", {
        ...form,
        username: user.username
      });

      alert("Complaint registered successfully!");
      navigate("/viewcomplaints");

    } catch (err) {
      setError("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <style>{`
        .page {
          min-height: 100vh;
          padding: 40px 20px;
          background: linear-gradient(270deg,#ff9a9e,#fad0c4,#a1c4fd,#c2e9fb);
          background-size: 600% 600%;
          animation: bgFlow 18s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @keyframes bgFlow {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }

        form {
          background: white;
          padding: 25px;
          border-radius: 16px;
          max-width: 520px;
          width: 100%;
          box-shadow: 0 15px 30px rgba(0,0,0,0.25);
        }

        input, select, textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        iframe {
          width: 100%;
          height: 250px;
          border-radius: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #003366;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.05rem;
          cursor: pointer;
        }

        button:hover { background:#00509e }
        .error { color:red; margin-bottom:10px }
      `}</style>

      <h2>Register a Complaint</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Complainant Name" value={form.name} onChange={handleChange} required />
        <input name="location" placeholder="Crime Location (Area / City)" value={form.location} onChange={handleChange} required />

        {/* 🔹 GOOGLE MAP (FREE) */}
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(form.location || "India")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          loading="lazy"
        />

        <input name="latitude" placeholder="Latitude (optional)" value={form.latitude} onChange={handleChange} />
        <input name="longitude" placeholder="Longitude (optional)" value={form.longitude} onChange={handleChange} />

        <select name="crimeType" value={form.crimeType} onChange={handleChange} required>
          <option value="">Select Crime Type</option>
          {Object.keys(crimeIpcMapping).map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input value={form.ipcSection} readOnly placeholder="IPC Section" />
        <textarea name="detail" placeholder="Crime Details" value={form.detail} onChange={handleChange} required />
        <input type="file" name="evidence" onChange={handleChange} />

        <input type="date" name="date" value={form.date}
          max={new Date().toISOString().split("T")[0]}
          onChange={handleChange} required />

        <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

export default Dashboard;