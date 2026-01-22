// Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const allowedPoliceIDs = ['POLICE123', 'POLICE456'];

function Signup() {
  const [form, setForm] = useState({
    role: '', name: '', dob: '', gender: '', mobile: '',
    email: '', username: '', password: '', confirmPassword: '',
    image: '', policeId: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (!/^[A-Za-z]+(\s[A-Za-z]+)*$/.test(value))
          error = 'Only letters and spaces allowed';
        break;

      case 'mobile':
        if (!value.trim()) error = 'Mobile number is required';
        else if (!/^\d{10}$/.test(value))
          error = 'Mobile must be 10 digits';
        break;

      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = 'Invalid email format';
        break;

      case 'username':
        if (!value.trim()) error = 'Username is required';
        else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value))
          error = 'Username must start with a letter';
        break;

      case 'password':
        if (!value.trim()) error = 'Password is required';
        else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value))
          error = 'Password must include uppercase, digit & special char';
        break;

      case 'confirmPassword':
        if (!value.trim()) error = 'Please confirm password';
        else if (value !== form.password)
          error = 'Passwords do not match';
        break;

      case 'dob':
        if (!value.trim()) error = 'Date of Birth is required';
        break;

      case 'gender':
        if (!value.trim()) error = 'Gender is required';
        break;

      case 'role':
        if (!value.trim()) error = 'Role is required';
        break;

      case 'policeId':
        if (form.role === 'Police') {
          if (!value.trim()) error = 'Police ID is required';
          else if (!allowedPoliceIDs.includes(value))
            error = 'Invalid Police ID';
        }
        break;

      case 'image':
        if (!value.trim()) error = 'Profile image is required';
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      validateField('image', '');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
      validateField('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Object.keys(form).forEach(field => validateField(field, form[field]));

    const hasErrors =
      Object.values(errors).some(err => err) ||
      Object.keys(form).some(key => key !== 'policeId' && !form[key]);

    if (hasErrors) {
      alert('Please fix errors before submitting');
      return;
    }

    try {
      const payload = {
        name: form.name,
        dob: form.dob,
        gender: form.gender,
        mobile: form.mobile,
        email: form.email,
        username: form.username,
        password: form.password,
        role: form.role.toLowerCase(),
        image: form.image,
        policeId: form.role === 'Police' ? form.policeId : null
      };

      await axios.post(
        'http://localhost:5000/api/auth/register',
        payload
      );

      alert(
        form.role === 'Police'
          ? 'Police registered. Waiting for admin approval.'
          : 'Signup successful!'
      );

      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
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
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        .signup-box {
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
          max-width: 500px;
          width: 100%;
        }

        .signup-box h2 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        .signup-box form {
          display: flex;
          flex-direction: column;
        }

        .signup-box input,
        .signup-box select {
          padding: 10px;
          margin-bottom: 5px;
          border: 1px solid #aaa;
          border-radius: 5px;
        }

        .error {
          color: red;
          font-size: 0.9em;
          margin-bottom: 10px;
        }

        .signup-box button {
          background-color: #4caf50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .signup-box button:hover {
          background-color: #388e3c;
        }

        .signup-box img {
          width: 120px;
          border-radius: 50%;
          margin-top: 10px;
          align-self: center;
        }
      `}</style>

      <div className="rainbow-bg">
        <div className="signup-box">
          <h2>Sign Up</h2>

          <form onSubmit={handleSubmit} noValidate>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Public">Public</option>
              <option value="Police">Police</option>
            </select>
            {errors.role && <div className="error">{errors.role}</div>}

            {form.role === 'Police' && (
              <>
                <input
                  name="policeId"
                  placeholder="Police ID"
                  value={form.policeId}
                  onChange={handleChange}
                />
                {errors.policeId && <div className="error">{errors.policeId}</div>}
              </>
            )}

            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
            {errors.name && <div className="error">{errors.name}</div>}

            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dob && <div className="error">{errors.dob}</div>}

            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <div className="error">{errors.gender}</div>}

            <input name="mobile" placeholder="Mobile No." value={form.mobile} onChange={handleChange} />
            {errors.mobile && <div className="error">{errors.mobile}</div>}

            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            {errors.email && <div className="error">{errors.email}</div>}

            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
            {errors.username && <div className="error">{errors.username}</div>}

            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            {errors.password && <div className="error">{errors.password}</div>}

            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

            <label>Upload Profile Image:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {errors.image && <div className="error">{errors.image}</div>}
            {form.image && <img src={form.image} alt="Preview" />}

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;