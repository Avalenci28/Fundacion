import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import express from 'express';

export default function configApp(app) {
  // Security
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
      },
    },
  }));
  app.use(hpp());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);

  // CORS
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://malambosonrie.org', 'https://www.malambosonrie.org'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser
  app.use(cookieParser());

  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  return app;
}
