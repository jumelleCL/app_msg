import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        var user = localStorage.getItem('username');
        const response = await axios.get('http://localhost:8000/check-auth', { 
          username: user,
          withCredentials: true, 
        });
        if (response.data.authenticated) {
          setUsername(response.data.username);
          console.log('user:'+username);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking authentication', error);
        navigate('/login');
      }
    };

    checkAuth();

    const socket = io('http://localhost:8000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      socket.emit('load messages');
    });

    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    socket.on('load messages', (msgs) => {
      setMessages(msgs);
    });

    return () => socket.disconnect();
  }, [navigate, username]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputMessage) {
      const socket = io('http://localhost:8000', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });
      socket.emit('chat message', inputMessage, username);
      console.log(username);
      
      setInputMessage('');
    }
  };

  return (
    <div className="screen" style={{ height: 'calc(100vh - 60px)' }}>
      <section id="contacts" className="p-3">
        <Button href="/login" className="logout" variant="danger">Log Out</Button>
      </section>
      <section id="chat" className="p-3">
        <ul id="messages" className="list-group mb-3">
          {messages.map((message) => (
            <li key={message._id} className="list-group-item">{message.sender}: {message.content}</li>
          ))}
        </ul>
        <Form onSubmit={handleSubmit} id="form" className="d-flex">
          <Form.Control
            type="text"
            name="message"
            id="input"
            placeholder="Type a message"
            autoComplete="off"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow-1 me-2"
          />
          <Button type="submit">Send</Button>
        </Form>
      </section>
    </div>
  );
};

export default Chat;
