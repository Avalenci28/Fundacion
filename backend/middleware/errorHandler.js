
import ErrorResponse from '../utils/errorResponse.js';

export default (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('ERROR', err);

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ErrorResponse(message, 401);
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  if (err.code === '23503') {
    const message = 'Foreign key violation';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
