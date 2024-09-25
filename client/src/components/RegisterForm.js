import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Línea modificada

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerStatus, setRegisterStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/register', {
                username,
                password,
            });

            const data = response.data;
            console.log(data.message);

            if (data.success) {
                window.location.href = '/login';
            } else {
                setRegisterStatus(data.message || 'Error registrando usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            setRegisterStatus('Error al intentar registrar usuario');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{height: 'calc(100vh - 60px)'}}>
            <div className="bg-dark-subtle p-4" style={{ maxWidth: '400px' }}>
                <h1 className="text-center">Sign up</h1>
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
    );
};

export default RegisterForm;
