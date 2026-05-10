import express from 'express';
import pool from './config/database.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/test-contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    console.log('Received:', { name, email, phone, subject, message });
    const result = await pool.query(`
      INSERT INTO contacts (name, email, phone, subject, message, is_read, is_replied)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [name, email, phone || '', subject, message, false, false]);
    res.json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const server = app.listen(5999, () => {
  console.log('Test server on 5999');
  setTimeout(() => {
    server.close();
    process.exit(0);
  }, 2000);
});
