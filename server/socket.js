const Message = require('./models/Message');
const onlineUsers = new Map();

function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.on('login', (username) => {
      socket.username = username;
      onlineUsers.set(username, socket.id);
      console.log(`${username} logged in`);
    });

    socket.on('message', async (msg) => {
      const newMsg = new Message(msg);
      const savedMsg = await newMsg.save();
      const recipientSocket = onlineUsers.get(msg.recipient);
      if (recipientSocket) {
        io.to(recipientSocket).emit('message', savedMsg);
      }
    });

    socket.on('disconnect', () => {
      if (socket.username) onlineUsers.delete(socket.username);
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = setupSocket;
