// server/index.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// MongoDB connection
// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});


// Modify MessageSchema in index.js
const MessageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);
// Add to server/index.js
const User = require('./models/User'); // <- Add this at the top

// Create user
app.post('/users', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send('Username required');
  try {
    const user = await User.create({ username });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Username must be unique' });
  }
});

// Get all users (optionally filter by search)
app.get('/users', async (req, res) => {
  const { search } = req.query;
  const query = search ? { username: new RegExp(search, 'i') } : {};
  const users = await User.find(query).select('username');
  res.json(users);
});


// Get all messages
app.get('/messages', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

const onlineUsers = new Map();

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
      io.to(recipientSocket).emit('message', savedMsg); // Notify recipient
    }
  });

  socket.on('disconnect', () => {
    if (socket.username) onlineUsers.delete(socket.username);
    console.log('User disconnected:', socket.id);
  });
});


server.listen(3001, () => console.log('Server running on http://localhost:3001'));
