import express from "express";
import logger from 'morgan';

import { Server } from "socket.io";
import {createServer} from 'node:http';

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server,{
    connectionStateRecovery: {
        maxDisconnectionDuration:{}
    }
})

io.on('connection',(socket) => {
    console.log('a user has connected');

    socket.on('disconnect', ()=> {
        console.log('user has disconnected');
    })

    socket.on('chat message',(msg)=>{
        io.emit('chat message',msg);
    })
})
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/',(req, res)=> {
    res.sendFile(path.join(__dirname,'src','view','index.html'))
})

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})