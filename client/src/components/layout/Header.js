import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <div className="container">
                <Navbar.Brand as={Link} to="/">
                    <img src='/logo.png' alt='logo' style={{ width: '50px', marginRight: '10px' }} />ChatApp
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarSupportedContent">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                        <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
                        <Nav.Link as={Link} to="/chat">Chat</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default Header;
