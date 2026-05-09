require('dotenv').config();

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// ── Boot ──────────────────────────────────────────────────────────
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ── Security middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Logging ───────────────────────────────────────────────────────
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// ── Rate limiting ─────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });
app.use('/api/auth/', authLimiter);

// ── Socket.IO ─────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: FRONTEND_URL, methods: ['GET', 'POST'], credentials: true },
});

const onlineUsers = new Map(); // socketId -> userId

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('register-user', (userId) => {
    onlineUsers.set(socket.id, userId);
    socket.userId = userId;
    socket.join(userId.toString());
    logger.debug(`User ${userId} registered on socket ${socket.id}`);
    io.emit('user-status', { userId, status: 'online' });
  });

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    logger.debug(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
  });

  socket.on('send-message', async (data) => {
    const { chatId, content, senderId } = data;
    socket.to(chatId).emit('new-message', { content, senderId, chatId, createdAt: new Date() });
  });

  socket.on('typing', ({ chatId, userId }) => {
    socket.to(chatId).emit('user-typing', { userId, chatId });
  });

  socket.on('stop-typing', ({ chatId, userId }) => {
    socket.to(chatId).emit('user-stop-typing', { userId, chatId });
  });

  socket.on('mark-read', async ({ chatId, userId }) => {
    try {
      const { markMessagesRead } = require('./services/chat.service');
      await markMessagesRead(chatId, userId);
      socket.to(chatId).emit('messages-read', { chatId, userId });
    } catch (err) {
      logger.error(`mark-read error: ${err.message}`);
    }
  });

  socket.on('disconnect', () => {
    const userId = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    logger.info(`Socket disconnected: ${socket.id}`);
    if (userId) {
      const stillOnline = [...onlineUsers.values()].some((id) => id === userId);
      if (!stillOnline) {
        io.emit('user-status', { userId, status: 'offline' });
      }
    }
  });
});

app.locals.io = io;

// ── Wire notification service for real-time delivery ─────────────
const notificationService = require('./services/notification.service');
notificationService.setIo(io);

// ── Routes ────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message: 'Vibe Connect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      chat: '/api/chat',
      match: '/api/vibe/match',
      notifications: '/api/notifications',
      ai: '/api/ai',
      admin: '/api/admin',
    },
  });
});

app.get('/health', (_req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/vibe', require('./routes/vibe'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

// ── 404 catch-all ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────
async function start() {
  await connectDB();
  httpServer.listen(PORT, () => {
    logger.info(`Vibe Connect API running on http://localhost:${PORT}`);
  });
}

start();

module.exports = { app, io };
