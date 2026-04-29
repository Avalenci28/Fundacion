const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');



const validateAndConnectDB = require('./validateAndTestServer');

const app = express();



// ✅ Validación y conexión a la base de datos
await validateAndConnectDB();




// ✅ Configuración de middlewares centralizada
const configApp = require('./config/app');
configApp(app);

// ✅ Rutas principales
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/events', require('./routes/events'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/volunteers', require('./routes/volunteers'));

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Status Check
app.get('/status', (req, res) => {
  const readyState = mongoose.connection.readyState;
  
  if (readyState === 1) {
    res.json({
      status: 'ok',
      db: 'connected',
      host: mongoose.connection.host,
      dbName: mongoose.connection.name
    });
  } else {
    res.json({
      status: 'error',
      db: 'disconnected'
    });
  }
});





// ✅ Manejador de errores global
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ✅ Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ✅ Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



