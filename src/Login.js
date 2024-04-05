import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Make API call to authenticate user using Axios
      const response = await axios.post('http://localhost:4000/api/login', {
        username: 'admin',
        password: 'password',
      });

      if (response.status === 200) {
        // Successful login
        // Redirect or perform necessary actions
      } else {
        // Failed login
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
