const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const {
    MongoClient
} = require('mongodb');
const {
    Server
} = require('socket.io');
const {
    createServer
} = require('http');
const cors = require('cors');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'A4gQeWBHbrsUnSOaAA3gQeWBHbrsUnSOaAagQeWBHbrsUnSOa',
    resave: false,
    saveUninitialized: true
}));

// MongoDB y otras configuraciones
let db;
let usersCollection;
let user;

const connectToDatabase = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
        return client.db('chatApp');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        throw err;
    }
};

const startServer = async () => {
    try {
        db = await connectToDatabase();
        usersCollection = db.collection('users');

        startSocketIO();
        defineRoutes();

        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};


const obtenerNombreUnico = (socket) => {
    if (user) {
        return user;
    } else {
        return 'Guest';
    }
};

const startSocketIO = async () => {
    db = await connectToDatabase();
    usersCollection = db.collection('users');

    io.on('connection', async (socket) => {
        socket.username = obtenerNombreUnico(socket);

        console.log(`User ${socket.username} has connected`);

        socket.on('disconnect', () => {
            console.log(`User ${socket.username} has disconnected`);
            if (socket.handshake.session) {
                socket.handshake.session.destroy((err) => {
                    if (err) {
                        console.error('Error destroying session:', err);
                    }
                });
            }
        });

        socket.on('chat message', async (msg) => {
            try {
                const result = await db.collection('messages').insertOne({
                    content: msg,
                    sender: socket.username
                });
                io.emit('chat message', msg, socket.username, result.insertedId.toString());
            } catch (e) {
                console.error(e);
                return;
            }
        });

        const messages = await db.collection('messages').find().toArray();
        messages.forEach((message) => {
            io.to(socket.id).emit('chat message', message.content, message.sender, message._id.toString());
        });
    });
};

const defineRoutes = () => {
    app.get('/chat', (req, res) => {
        if (!req.session.username || req.session.username === 'Guest') {
            return res.redirect('/login');
        }
        res.sendFile(path.join(__dirname, '../../client/public/index.html'));
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/public/index.html'));
    });

    app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const passwordAsInt = parseInt(password, 10);
    try {
        const userRecord = await usersCollection.findOne({ username, password: passwordAsInt });

        if (userRecord) {
            req.session.username = username;
            res.json({ success: true });
            user = username;
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/public/index.html'));
    });

    app.post('/register', async (req, res) => {
        const {
            username,
            password
        } = req.body;

        try {
            const userRecord = await usersCollection.findOne({
                username
            });

            if (userRecord) {
                res.status(409).json({
                    success: false,
                    message: 'El usuario ya existe'
                });
            } else {
                const result = await usersCollection.insertOne({
                    username,
                    password
                });
                console.log('Usuario registrado:', result);

                req.session.username = username;
                res.json({
                    success: true
                });
                user = username;
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    });
};

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

startSocketIO();

startServer();