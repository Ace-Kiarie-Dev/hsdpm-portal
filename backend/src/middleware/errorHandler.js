import { config } from '../config/env.js';

export function errorHandler(err, req, res, _next) {
  const isDev = config.nodeEnv === 'development';

  if (isDev) {
    console.error(`[Error] ${req.method} ${req.path}:`, err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue?.[field];
    return res.status(409).json({
      success: false,
      message: `An account with that ${field}${value ? ` (${value})` : ''} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError'
        ? 'Session expired. Please sign in again.'
        : 'Invalid token',
    });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    });
  }

  // Generic fallback
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : 'An unexpected error occurred. Please try again.',
    ...(isDev && { stack: err.stack }),
  });
}
