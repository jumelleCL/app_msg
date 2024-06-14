import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ height: 'calc(100vh - 60px)'}}>
            <div className="text-center p-4 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                <h1>Welcome to ChatApp</h1>
                <p>A fast message application</p>
                <Link to="/chat" className="btn btn-primary">Start Chatting</Link>
            </div>
        </div>
    );
}

export default Home;
