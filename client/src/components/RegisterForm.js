import React, { useState } from 'react';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerStatus, setRegisterStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = '/chat';
            } else {
                setRegisterStatus(data.message || 'Error registrando usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            setRegisterStatus('Error al intentar registrar usuario');
        }
    };

    return (
        <div>
            <h1>Messages Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" className="elemLogin" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" className="elemLogin" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit" className="elemLogin">Register</button>
            </form>
            <div id="loginStatus">{registerStatus}</div>
        </div>
    );
};

export default RegisterForm;
