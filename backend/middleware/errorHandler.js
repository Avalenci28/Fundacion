
import ErrorResponse from '../utils/errorResponse.js';

export default (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('ERROR', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

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

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};



