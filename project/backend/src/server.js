require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const {
  dashRouter, analyticsRouter, projectsRouter,
  notificationsRouter, subscriptionsRouter,
} = require('./routes/index');

/* ─── App setup ───────────────────────────────────────────────── */
const app = express();
const PORT = process.env.PORT || 5000;

/* ─── Connect DB ──────────────────────────────────────────────── */
connectDB();

/* ─── Ensure upload dirs exist ────────────────────────────────── */
['uploads/avatars'].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ─── Security middleware ─────────────────────────────────────── */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please try again in 15 minutes.' },
});

app.use('/api', limiter);
app.use('/api/auth', authLimiter);

/* ─── Body parsing ────────────────────────────────────────────── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

/* ─── Logging ─────────────────────────────────────────────────── */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

/* ─── Static files ────────────────────────────────────────────── */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* ─── Routes ──────────────────────────────────────────────────── */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/subscriptions', subscriptionsRouter);

/* ─── Health check ────────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SAAS Dashboard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

/* ─── 404 handler ─────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

/* ─── Global error handler ────────────────────────────────────── */
app.use(errorHandler);

/* ─── Graceful shutdown ───────────────────────────────────────── */
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});

/* ─── Start server ────────────────────────────────────────────── */
const server = app.listen(PORT, () => {
  logger.info(`🚀 SAAS Dashboard API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
