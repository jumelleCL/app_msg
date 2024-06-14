import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

    return ((
        <div className="d-flex align-items-center justify-content-center" style={{height: 'calc(100vh - 60px)'}}>
            <div className="bg-dark-subtle p-4" style={{ maxWidth: '400px' }}>
                <h1 className="text-center">Sing up</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Register
                    </Button>
                </Form>
                <div id="loginStatus" className="text-center mt-3">{registerStatus}</div>
                <div className="text-center mt-3">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    ));
    };

export default RegisterForm;
