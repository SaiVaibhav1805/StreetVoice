import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurations
import connectDB from './config/db.js';
import { initFirebase } from './config/firebase.js';
import { initCloudinary } from './config/cloudinary.js';

// Middlewares
import errorHandler from './middleware/errorHandler.js';

// Routers
import authRoutes from './routes/auth.js';
import issueRoutes from './routes/issues.js';
import userRoutes from './routes/users.js';
import verifyRoutes from './routes/verify.js';
import dashboardRoutes from './routes/dashboard.js';
import aiRoutes from './routes/ai.js';
import notificationRoutes from './routes/notifications.js';

// Environment load
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('socketio', io);

// Ensure uploads folder exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware stack
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Base route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'StreetVoice core services are operational.' });
});

// Error handling middleware
app.use(errorHandler);

// Database and Service Connections
connectDB();
initFirebase();
initCloudinary();

// Socket Connection Handler
io.on('connection', (socket) => {
  console.log(`New socket.io client connection: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`StreetVoice API server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
