const fetch = require('node-fetch');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/.env' });

const STATUS_URL = 'http://localhost:5000/status';
const LOG_FILE = './db-errors.log';
const INTERVAL_MS = 60 * 1000; // 60 segundos

const logError = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console.error(logEntry.trim());
  fs.appendFileSync(LOG_FILE, logEntry);
};

const sendAlertEmail = async (timestamp) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Fundación Monitor" <${process.env.SMTP_USER}>`,
      to: 'admin@fundacion.org',
      subject: '⚠️ DB ERROR - Fundación Backend',
      text: `La base de datos se desconectó a las ${timestamp}.
Revisa el servidor Atlas.

Logs: ${LOG_FILE}`,
      html: `<h2>⚠️ DB ERROR - Fundación Backend</h2>
<p>La base de datos se desconectó a las <strong>${timestamp}</strong>.</p>
<p>Revisa el servidor Atlas.</p>
<p><strong>Logs:</strong> ${LOG_FILE}</p>`
    });

    console.log('📧 Alerta enviada a admin@fundacion.org');
  } catch (error) {
    console.error('❌ Error enviando alerta por correo:', error.message);
  }
};

const checkStatus = async () => {
  try {
    const response = await fetch(STATUS_URL, {
      timeout: 5000
    });
    
    if (!response.ok) {
      logError(`HTTP ${response.status} - Server no responde`);
      return;
    }
    
    const data = await response.json();
    
    if (data.db === 'connected') {
      const timestamp = new Date().toLocaleString();
      console.log(`✅ DB OK - ${timestamp}`);
    } else {
      const timestamp = new Date().toLocaleString();
      const errorMsg = `DB ERROR - ${data.status} - ${timestamp}`;
      logError(errorMsg);
      
      // Enviar alerta por correo
      await sendAlertEmail(timestamp);
    }
    
  } catch (error) {
    const timestamp = new Date().toLocaleString();
    logError(`ERROR request - ${error.message} - ${timestamp}`);
  }
};

console.log('🚀 Status Monitor iniciado - Verificando cada 60s');
console.log(`📡 Endpoint: ${STATUS_URL}`);
console.log(`📝 Logs errores: ${LOG_FILE}\n`);

// Primera verificación inmediata
checkStatus();

// Repetir cada 60 segundos
setInterval(checkStatus, INTERVAL_MS);

process.on('SIGINT', () => {
  console.log('\n👋 Status Monitor detenido');
  process.exit(0);
});
