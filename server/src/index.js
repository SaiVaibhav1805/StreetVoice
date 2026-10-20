import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import authorityRoutes from './routes/authority.js';
import issueRoutes from './routes/issues.js';
import aiRoutes from './routes/ai.js';
import dashboardRoutes from './routes/dashboard.js';
import verifyRoutes from './routes/verify.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';

import startEscalationJob from './jobs/escalationJob.js';
import startPredictionJob from './jobs/predictionJob.js';
import startReminderJob from './jobs/reminderJob.js';

const app = express();
const server = http.createServer(app);

// Enable CORS and other security middlewares first
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  return true;
};

app.use(cors({
  origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible in controllers
app.set('io', io);

// Route mounts
app.use('/api/auth', authRoutes);
app.use('/api/authority', authorityRoutes);
app.use('/api/issues/:id/verifications', verifyRoutes);
app.use('/api/issues/:id/comments', commentRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StreetVoice API is running' });
});

// Serve static assets in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

// Fallback to React app index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start background jobs
startEscalationJob();
startPredictionJob();
startReminderJob();

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

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`StreetVoice server running on port ${PORT}`);
  });
});