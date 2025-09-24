import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(express.json());

// In-memory storage
const rooms = new Map();
const users = new Map();

// Utility function to generate room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// API Routes
app.post('/api/create-room', (req, res) => {
  const { username } = req.body;
  
  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' });
  }

  let roomId;
  let attempts = 0;
  
  // Generate unique room ID
  do {
    roomId = generateRoomId();
    attempts++;
  } while (rooms.has(roomId) && attempts < 10);

  if (attempts >= 10) {
    return res.status(500).json({ error: 'Failed to generate unique room ID' });
  }

  // Create new room
  rooms.set(roomId, {
    id: roomId,
    users: new Set(),
    messages: [],
    createdAt: new Date(),
    password: null
  });

  res.json({ 
    roomId, 
    link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/chat/${roomId}`
  });
});

app.get('/api/room/:roomId/exists', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId.toUpperCase());
  
  if (room) {
    res.json({ exists: true, users: Array.from(room.users) });
  } else {
    res.json({ exists: false });
  }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ roomId, username }) => {
    const room = rooms.get(roomId.toUpperCase());
    
    if (!room) {
      socket.emit('error', 'Room does not exist');
      return;
    }

    // Join the room
    socket.join(roomId);
    
    // Store user info
    users.set(socket.id, { roomId, username });
    
    // Add user to room
    room.users.add(username);
    
    // Notify others
    socket.to(roomId).emit('userJoined', {
      username,
      message: `${username} joined the chat`,
      timestamp: new Date(),
      type: 'system'
    });

    // Send room history to joining user
    socket.emit('roomHistory', room.messages);

    console.log(`User ${username} joined room ${roomId}`);
  });

  socket.on('chatMessage', ({ roomId, username, message }) => {
    const room = rooms.get(roomId.toUpperCase());
    
    if (!room || !room.users.has(username)) {
      socket.emit('error', 'Not authorized to send messages');
      return;
    }

    const messageData = {
      id: Date.now().toString(),
      username,
      message: message.trim(),
      timestamp: new Date(),
      type: 'user'
    };

    // Add message to room history
    room.messages.push(messageData);

    // Broadcast to all in room
    io.to(roomId).emit('newMessage', messageData);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    
    if (user) {
      const { roomId, username } = user;
      const room = rooms.get(roomId.toUpperCase());
      
      if (room) {
        // Remove user from room
        room.users.delete(username);
        
        // Notify others
        socket.to(roomId).emit('userLeft', {
          username,
          message: `${username} left the chat`,
          timestamp: new Date(),
          type: 'system'
        });

        // Clean up empty rooms
        if (room.users.size === 0) {
          setTimeout(() => {
            if (room.users.size === 0) {
              rooms.delete(roomId.toUpperCase());
              console.log(`Room ${roomId} deleted (empty)`);
            }
          }, 5000); // 5 second delay before deletion
        }
      }
      
      users.delete(socket.id);
    }

    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});