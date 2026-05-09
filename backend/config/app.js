import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
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

  // DEBUG: log every request origin (remove after debugging)
  app.use((req, res, next) => {
    console.log('[' + req.method + ']', req.path, '| Origin:', req.headers.origin);
    next();
  });

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);

  // CORS - hardcoded origins, credentials, full methods
  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      // HARDCODED: si el navegador envía este origin, se permite
      const allowed = [
        'http://localhost:3000',
        'http://localhost:3001'
      ];

      console.log('[CORS check] origin received:', origin);
      console.log('[CORS check] allowed list:', allowed);
      console.log('[CORS check] match:', !origin ? 'ALLOWED (no origin)' : allowed.includes(origin) ? 'ALLOWED' : 'BLOCKED');

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS bloqueado: ' + origin));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  };

  // CORS middleware - ANTES de todas las rutas
  app.use(cors(corsOptions));

  // Preflight handler explícito - ANTES de rutas
  app.options('*', cors(corsOptions));

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