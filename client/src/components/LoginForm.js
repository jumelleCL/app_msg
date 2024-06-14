import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username: username,
        password: password,
      });
      const data = response.data;
      console.log(data);

      if (data.success) {
        window.location.href = '/chat';
      } else {
        setLoginStatus(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginStatus('Error al intentar iniciar sesión');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: 'calc(100vh - 60px)' }}>
      <div className="bg-dark-subtle p-4 rounded" style={{ maxWidth: '400px' }}>
        <h1 className="text-center">Log in</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          Don't have an account? <a href="/register" className="elemLogin register">Sign up here</a>
        </div>
        <div className="text-center mt-3">{loginStatus}</div>
      </div>
    </div>
  );
};

export default LoginForm;
