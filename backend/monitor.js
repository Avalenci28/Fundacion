const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.SMTP_USER;
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const transporter = nodemailer.createTransporter(SMTP_CONFIG);

async function checkHealth() {
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    console.log('API OK:', response.status);
  } catch (error) {
    console.error('API DOWN:', error.message);
    await sendAlert('API DOWN', error.message);
  }

  try {
    const pool = require('./config/database');
    await pool.query('SELECT 1');
    console.log('DB OK');
  } catch (error) {
    console.error('DB DOWN:', error.message);
    await sendAlert('DB DOWN', error.message);
  }
}

async function sendAlert(subject, message) {
  await transporter.sendMail({
    from: ADMIN_EMAIL,
    to: ADMIN_EMAIL,
    subject,
    text: message
  });
}

// Run every hour
setInterval(checkHealth, 60 * 60 * 1000);
checkHealth();
