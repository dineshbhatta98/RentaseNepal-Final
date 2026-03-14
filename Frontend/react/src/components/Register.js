import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'renter', // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setSuccess('');
      setError('Password and Confirm Password do not match.');
      return;
    }

    console.log(JSON.stringify(formData));

    try {
      const response = await fetch('https://api.rentasenepal.com/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setError('');
        setSuccess('Account created successfully. You can now log in.');
        // setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
      } else {
        setSuccess('');
        if(data.data.email)
          setError(data.data.email[0]);
        else if(data.data.username)
          setError(data.data.username[0]);
        else 
          setError('Registration Failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create New Account</h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <div className="radio-group">
            <label>Role:</label>
            <label>
              <input
                type="radio"
                name="role"
                value="renter"
                checked={formData.role === 'renter'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              Renter
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              User
            </label>
          </div>

          <button type="submit" className="login-button">Register</button>
        </form>

        <div className="create-account">
          <p>Already have an account? <a href="/login">Log In</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
