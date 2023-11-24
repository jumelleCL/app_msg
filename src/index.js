import dotenv from 'dotenv';
dotenv.config()

import express from "express";
import logger from 'morgan';
import { MongoClient } from "mongodb";

import { Server } from "socket.io";
import {createServer} from 'http';


const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server,{
    connectionStateRecovery: {}
})


const connectToDatabase = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        const db = client.db();

        const collection = db.collection('messages');

        const collections = await db.listCollections({ name: 'messages' }).toArray();
        const collectionExists = collections.length > 0;

        if (!collectionExists) {
            await db.createCollection('messages');
        }

        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        throw err;
    }
};

let db = await connectToDatabase();

io.on('connection', async (socket) => {
    console.log('a user has connected');

    const messagesCollection = db.collection('messages');
    const collections = await db.listCollections().toArray();
    
    const collectionExists = collections.some((collection) => collection.name === 'messages');

    if (!collectionExists) {
        await db.createCollection('messages');
    }

    const cursor = messagesCollection.find();
    await cursor.forEach((doc) => {
        socket.emit('chat message', doc.content, doc._id.toString());
    });

    socket.on('disconnect', () => {
        console.log('user has disconnected');
    });

    socket.on('chat message', async (msg) => {
        try {
            const result = await db.collection('messages').insertOne({ content: msg });
            io.emit('chat message', msg, result.insertedId.toString());
        } catch (e) {
            console.error(e);
            return;
        }
    });

    if (!socket.recovered) {
        try {
            const cursor = db.collection('messages').find({ _id: { $gt: socket.handshake.auth.serverOffset ?? 0 } });
            await cursor.forEach((doc) => {
                socket.emit('chat message', doc.content, doc._id.toString());
            });
        } catch (e) {
            console.error(e);
            return;
        }
    }
});


app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/src/views/index.html')
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})