const { Server } = require('socket.io');

const startSocketIO = (server, db) => {
  const io = new Server(server);

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('chat message', async (msg, username) => {
      try {
        const result = await db.collection('messages').insertOne({
          content: msg,
          sender: username,
          timestamp: new Date()
        });
        const insertedMessage = {
          _id: result.insertedId.toString(),
          content: msg,
          sender: username,
          timestamp: new Date()
        };
        io.emit('chat message', insertedMessage);
      } catch (e) {
        console.error('Error saving message:', e);
      }
    });

    socket.on('load messages', async () => {
      try {
        const messages = await db.collection('messages').find().toArray();
        socket.emit('load messages', messages);
      } catch (e) {
        console.error('Error loading messages:', e);
      }
    });
  });
};

module.exports = { startSocketIO };
