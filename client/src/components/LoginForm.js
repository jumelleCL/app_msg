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
        username,
        password,
      });

      const data = response.data;

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
    <div>
      <h1>Messages Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="elemLogin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          className="elemLogin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" className="elemLogin">
          Login
        </button>
      </form>
      <div id="registerForm">
        <a href="/register" className="elemLogin register">
          You don't have an account?
        </a>
      </div>
      <div id="loginStatus">{loginStatus}</div>
    </div>
  );
};

export default LoginForm;
