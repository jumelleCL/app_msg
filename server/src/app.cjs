const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const { createServer } = require('http');
const cors = require('cors');
const { connectDB } = require('./db.cjs');
const { startSocketIO } = require('./socket.cjs');
const { defineRoutes } = require('./routes.cjs');

dotenv.config();

const app = express();
const server = createServer(app);

const port = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.static(path.join(__dirname, '../../client/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: connectDB().sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

const startServer = async () => {
  try {
    const db = await connectDB().db;
    startSocketIO(server, db);
    defineRoutes(app, db);

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

module.exports = { startServer };
