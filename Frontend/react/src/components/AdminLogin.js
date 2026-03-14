import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setIsLoggedIn, setUserRole }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.rentasenepal.com/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const role=data.role;
        console.log(data);

        if(role === 'admin')
          localStorage.setItem('admin-token', data.data.token); // Save token
        else
          localStorage.setItem('user-token', data.data.token);
        setIsLoggedIn(true);
        setUserRole(role);
        navigate(role === 'admin'? '/admin': '/user');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin/User Login</h2>

        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* <label htmlFor="username">Username</label> */}
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            {/* <label htmlFor="password">Password</label> */}
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>

        <div className="create-account">
          <p>Don't have an account? <a href="/register">Create New Account</a></p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
