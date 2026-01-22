import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./AdminDashboard.css";
import ComplaintStats from "./ComplaintStats"; // ✅ NEW

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
    image: ""
  });

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchComplaints();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const fetchDepartments = async () => {
    const res = await api.get("/admin/departments");
    setDepartments(res.data);
  };

  const fetchComplaints = async () => {
    const res = await api.get("/complaints/view");
    setComplaints(res.data);
  };

  /* =========================
     USER ACTIONS
  ========================= */
  const approvePolice = async (id) => {
    await api.put(`/admin/approve-police/${id}`);
    fetchUsers();
  };

  const rejectPolice = async (id) => {
    if (!window.confirm("Reject this police user?")) return;
    await api.delete(`/admin/reject-police/${id}`);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/user/${id}`);
    fetchUsers();
  };

  const assignDepartment = async (id, department) => {
    await api.put(`/admin/assign-department/${id}`, { department });
    fetchUsers();
  };

  /* =========================
     DEPARTMENT ACTIONS
  ========================= */
  const handleDeptImage = (e) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      setNewDept((p) => ({ ...p, image: reader.result }));
    reader.readAsDataURL(e.target.files[0]);
  };

  const createDepartment = async () => {
    if (!newDept.name || !newDept.description) return;
    await api.post("/admin/department", newDept);
    setNewDept({ name: "", description: "", image: "" });
    fetchDepartments();
  };

  /* =========================
     FILTERED COMPLAINTS
  ========================= */
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (deptFilter !== "All" && c.department !== deptFilter) return false;
    return true;
  });

  /* =========================
     UI
  ========================= */
  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* ================= STATISTICS GRAPH ================= */}
      <ComplaintStats complaints={complaints} /> {/* ✅ NEW */}

      {/* ================= COMPLAINTS ================= */}
      <div className="section">
        <h3>All Complaints</h3>

        <div className="filters">
          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Under Investigation</option>
            <option>Solved</option>
            <option>Invalid</option>
          </select>

          <select onChange={(e) => setDeptFilter(e.target.value)}>
            <option>All</option>
            {departments.map(d => (
              <option key={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="complaint-grid">
          {filteredComplaints.map(c => (
            <div key={c._id} className="complaint-card">
              <h4>{c.crimeType}</h4>
              <p><b>User:</b> {c.username}</p>
              <p><b>Status:</b> {c.status}</p>
              <p><b>Location:</b> {c.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= USERS ================= */}
      <div className="section">
        <h3>All Users</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>

                <td>
                  {u.role === "police" && u.isApproved && (
                    <select onChange={(e) => assignDepartment(u._id, e.target.value)}>
                      <option>Select</option>
                      {departments.map(d => (
                        <option key={d._id}>{d.name}</option>
                      ))}
                    </select>
                  )}
                </td>

                <td>
                  {u.role === "police" && !u.isApproved && (
                    <>
                      <button className="btn-approve" onClick={() => approvePolice(u._id)}>
                        Approve
                      </button>
                      <button className="btn-delete" onClick={() => rejectPolice(u._id)}>
                        Reject
                      </button>
                    </>
                  )}

                  {(u.role === "public" || (u.role === "police" && u.isApproved)) && (
                    <button className="btn-delete" onClick={() => deleteUser(u._id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= DEPARTMENTS ================= */}
      <div className="section">
        <h3>Departments</h3>

        <div className="dept-grid">
          {departments.map(d => (
            <div key={d._id} className="dept-card">
              {d.image && <img src={d.image} alt={d.name} />}
              <h4>{d.name}</h4>
              <p>{d.description}</p>
            </div>
          ))}
        </div>

        <h4>Create Department</h4>
        <input
          placeholder="Name"
          value={newDept.name}
          onChange={e => setNewDept({ ...newDept, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newDept.description}
          onChange={e => setNewDept({ ...newDept, description: e.target.value })}
        />
        <input type="file" onChange={handleDeptImage} />
        <button onClick={createDepartment}>Create</button>
      </div>
    </div>
  );
}

export default AdminDashboard;