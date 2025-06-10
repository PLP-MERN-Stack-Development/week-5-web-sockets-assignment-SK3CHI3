// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};
const rooms = {
  'general': { name: 'General', messages: [] },
  'random': { name: 'Random', messages: [] },
  'tech': { name: 'Tech Talk', messages: [] }
};
const userRooms = {}; // Track which room each user is in

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    // Check if user is already connected (prevent duplicate joins)
    if (users[socket.id]) {
      return;
    }

    users[socket.id] = { username, id: socket.id, currentRoom: 'general' };
    userRooms[socket.id] = 'general';

    // Join the general room by default
    socket.join('general');

    // Send confirmation back to the user
    socket.emit('user_joined_confirmed', { username, id: socket.id });

    // Send available rooms
    socket.emit('rooms_list', Object.keys(rooms).map(key => ({ id: key, name: rooms[key].name })));

    // Send room messages
    socket.emit('room_messages', rooms['general'].messages);

    io.emit('user_list', Object.values(users));
    socket.broadcast.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    if (!users[socket.id]) return;

    const username = users[socket.id].username;
    const currentRoom = userRooms[socket.id] || 'general';

    // Stop typing indicator when message is sent
    if (typingUsers[socket.id]) {
      delete typingUsers[socket.id];
      socket.broadcast.to(currentRoom).emit('user_typing', { username, isTyping: false });
    }

    const message = {
      ...messageData,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      sender: username,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      room: currentRoom,
      reactions: {},
      delivered: true
    };

    // Store in room-specific messages
    if (rooms[currentRoom]) {
      rooms[currentRoom].messages.push(message);

      // Limit stored messages per room
      if (rooms[currentRoom].messages.length > 100) {
        rooms[currentRoom].messages.shift();
      }
    }

    // Also store in global messages for backward compatibility
    messages.push(message);
    if (messages.length > 100) {
      messages.shift();
    }

    // Send to all users in the same room
    io.to(currentRoom).emit('receive_message', message);

    // Send delivery acknowledgment
    socket.emit('message_delivered', { messageId: message.id });
  });

  // Handle typing indicator with enhanced state management
  socket.on('typing', (isTyping) => {
    if (!users[socket.id]) return;

    const username = users[socket.id].username;
    const currentRoom = userRooms[socket.id] || 'general';

    // Update typing state
    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }

    // Broadcast to everyone else in the same room
    socket.broadcast.to(currentRoom).emit('user_typing', { username, isTyping });
  });

  // Handle room switching
  socket.on('join_room', (roomId) => {
    if (!users[socket.id] || !rooms[roomId]) return;

    const username = users[socket.id].username;
    const oldRoom = userRooms[socket.id] || 'general';

    // Leave old room
    socket.leave(oldRoom);

    // Join new room
    socket.join(roomId);
    userRooms[socket.id] = roomId;
    users[socket.id].currentRoom = roomId;

    // Send room messages
    socket.emit('room_messages', rooms[roomId].messages);

    // Notify about room change
    socket.emit('room_changed', { roomId, roomName: rooms[roomId].name });

    console.log(`${username} switched from ${oldRoom} to ${roomId}`);
  });

  // Handle message reactions
  socket.on('add_reaction', ({ messageId, emoji }) => {
    if (!users[socket.id]) return;

    const username = users[socket.id].username;
    const currentRoom = userRooms[socket.id] || 'general';

    // Find message in current room
    const roomMessages = rooms[currentRoom]?.messages || [];
    const message = roomMessages.find(msg => msg.id === messageId);

    if (message) {
      if (!message.reactions[emoji]) {
        message.reactions[emoji] = [];
      }

      // Toggle reaction
      const userIndex = message.reactions[emoji].indexOf(username);
      if (userIndex > -1) {
        message.reactions[emoji].splice(userIndex, 1);
        if (message.reactions[emoji].length === 0) {
          delete message.reactions[emoji];
        }
      } else {
        message.reactions[emoji].push(username);
      }

      // Broadcast updated message to room
      io.to(currentRoom).emit('message_reaction_updated', {
        messageId,
        reactions: message.reactions
      });
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const sender = users[socket.id];
    const recipient = Object.values(users).find(user => user.id === to);

    if (!sender || !recipient) {
      return;
    }

    const messageData = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      sender: sender.username,
      senderId: socket.id,
      to: recipient.username,
      toId: to,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };

    // Send to recipient
    socket.to(to).emit('private_message', messageData);
    // Send back to sender for confirmation
    socket.emit('private_message', messageData);
  });

  // Handle file upload
  socket.on('upload_file', ({ fileName, fileData, fileType }) => {
    if (!users[socket.id]) return;

    const username = users[socket.id].username;
    const currentRoom = userRooms[socket.id] || 'general';

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      sender: username,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      room: currentRoom,
      isFile: true,
      fileName,
      fileData,
      fileType,
      reactions: {},
      delivered: true
    };

    // Store in room-specific messages
    if (rooms[currentRoom]) {
      rooms[currentRoom].messages.push(message);

      if (rooms[currentRoom].messages.length > 100) {
        rooms[currentRoom].messages.shift();
      }
    }

    // Send to all users in the same room
    io.to(currentRoom).emit('receive_message', message);

    // Send delivery acknowledgment
    socket.emit('message_delivered', { messageId: message.id });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      io.emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
    }

    delete users[socket.id];
    delete typingUsers[socket.id];
    delete userRooms[socket.id];

    io.emit('user_list', Object.values(users));
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

app.get('/api/rooms', (req, res) => {
  res.json(Object.keys(rooms).map(key => ({ id: key, name: rooms[key].name })));
});

app.get('/api/rooms/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  if (rooms[roomId]) {
    res.json(rooms[roomId].messages);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 