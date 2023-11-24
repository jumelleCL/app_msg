import express from "express";
import logger from 'morgan';

import { Server } from "socket.io";
import {createServer} from 'node:http';

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server)

io.on('connectuon',() => {
    console.log('a user has connected');
})
app.use(logger('dev'))


app.get('/',(req, res)=> {
    res.sendFile(process.cwd() + '/src/views/index.html')
})

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})