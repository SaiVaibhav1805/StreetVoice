import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Make io accessible in controllers later
app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StreetVoice API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join_issue', (issueId) => {
    socket.join(issueId);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`StreetVoice server running on port ${PORT}`);
  });
});