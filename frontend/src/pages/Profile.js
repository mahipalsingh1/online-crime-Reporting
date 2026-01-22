import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile({ user, onLogout }) {
  const navigate = useNavigate();
  const [editableUser, setEditableUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // 🔹 Step 1: get logged-in user
    const currentUser = user || JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
      alert("Please login to view your profile.");
      navigate('/login');
      return;
    }

    // 🔹 Step 2: get full users list
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];

    // 🔹 Step 3: find full user record
    const fullUser = allUsers.find(
      u => u.username === currentUser.username
    );

    // 🔹 Step 4: merge safely (IMPORTANT)
    setEditableUser({
      ...fullUser,
      ...currentUser
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditableUser(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];

    const updatedUsers = allUsers.map(u =>
      u.username === editableUser.username ? editableUser : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(editableUser));

    alert('Profile updated successfully!');
    setEditMode(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  if (!editableUser) return null;

  return (
    <div className="profile-container rainbow-bg">
      <h2>Your Profile</h2>

      <div className="profile-card">
        {editableUser.image && (
          <img
            src={editableUser.image}
            alt="Profile"
            className="profile-image"
          />
        )}

        {editMode && (
          <>
            <label>Change Profile Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </>
        )}

        <div className="profile-field">
          <label>Full Name:</label>
          {editMode ? (
            <input name="name" value={editableUser.name || ''} onChange={handleChange} />
          ) : (
            <span>{editableUser.name || "Not Available"}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Date of Birth:</label>
          {editMode ? (
            <input type="date" name="dob" value={editableUser.dob || ''} onChange={handleChange} />
          ) : (
            <span>{editableUser.dob || "Not Available"}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Gender:</label>
          {editMode ? (
            <select name="gender" value={editableUser.gender || ''} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <span>{editableUser.gender || "Not Available"}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Mobile:</label>
          {editMode ? (
            <input name="mobile" value={editableUser.mobile || ''} onChange={handleChange} />
          ) : (
            <span>{editableUser.mobile || "Not Available"}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Email:</label>
          {editMode ? (
            <input name="email" value={editableUser.email || ''} onChange={handleChange} />
          ) : (
            <span>{editableUser.email || "Not Available"}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Username:</label>
          <span>{editableUser.username || "Not Available"}</span>
        </div>

        <div className="profile-field">
          <label>Role:</label>
          <span>{editableUser.role}</span>
        </div>

        {editableUser.role === 'Police' && (
          <div className="profile-field">
            <label>Police ID:</label>
            <span>{editableUser.policeId || "Not Assigned"}</span>
          </div>
        )}

        <div className="button-row">
          <button className="edit-profile-btn" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>

          {editMode && (
            <button className="save-profile-btn" onClick={handleSave}>
              Save Changes
            </button>
          )}

          <button className="logout-profile-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;