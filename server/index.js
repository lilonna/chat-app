const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const postRoutes = require('./routes/post');
const uploadRoute = require('./routes/upload'); 
const userRoutes = require('./routes/users');
const setupSocket = require('./socket');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

setupSocket(io);

server.listen(3001, () => console.log('Server running on http://localhost:3001'));
