require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use((req, res, next) => { req.io = io; next(); });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.userId);
  socket.join(socket.userId);
  socket.on('disconnect', () => console.log('❌ Disconnected:', socket.userId));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(process.env.PORT || 5001, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5001}`);
      console.log(`⚡ WebSocket ready!`);
    });
  })
  .catch(err => { console.error('❌ DB Error:', err.message); process.exit(1); });