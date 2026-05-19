import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ── Security & parsing ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ── Rate limiting on auth routes ────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: { success: false, message: 'Too many requests from this IP. Please try again in 15 minutes.' },
});

app.use('/api/auth', authLimiter);
app.use('/api/users', authLimiter);

// ── Routes ──────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// POST /api/auth/register
app.use('/api/auth', authRouter);

// POST /api/users/register  +  GET|PUT /api/users/me
app.use('/api/users', authRouter);
app.use('/api/users', usersRouter);

// ── Global error handler (must be last) ────────────────────────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
  });
});
