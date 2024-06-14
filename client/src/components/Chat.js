import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  // eslint-disable-next-line
  const [username, setUsername] = useState('');

  useEffect(() => {
    const socket = io({
      auth: {
        serverOffset: 0,
      },
    });

    socket.on('connect', () => {
      setUsername(socket.username);
    });

    socket.on('chat message', (msg, username, serverOffset) => {
      setMessages(prevMessages => [...prevMessages, { msg, username, serverOffset }]);
    });

    return () => socket.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputMessage) {
      setInputMessage('');
    }
  };

  return (
    <div className="screen">
      <section id="contacts">
        <ul id="chats">
          {/* Renderizar la lista de chats */}
        </ul>
        <a href="/login" className="logout">Log Out</a>
      </section>
      <section id="chat">
        <ul id="messages">
          {messages.map((message, index) => (
            <li key={index}>{message.username}: {message.msg}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} id="form">
          <input
            type="text"
            name="message"
            id="input"
            placeholder="Type a message"
            autoComplete="off"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
