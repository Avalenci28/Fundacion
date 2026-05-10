import pool from '../config/database.js';
import { validationResult } from 'express-validator';

// Submit a new participation request
export const submitParticipation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

const { name, email, phone, skills = '', availability = '', motivation } = req.body;

    // Check if email already submitted with pending status
    const existingResult = await pool.query(
      'SELECT * FROM participations WHERE email = $1 AND status = $2',
      [email, 'pending']
    );
    
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya tienes una solicitud pendiente. El admin te contactará pronto.' 
      });
    }

    // Insert new participation request
    const result = await pool.query(
      `INSERT INTO participations (name, email, phone, skills, availability, motivation, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW()) 
       RETURNING *`,
      [name, email, phone, skills, availability, motivation]
    );

    // TODO: Send email notification to admin about new participation request

    res.status(201).json({
      success: true,
      message: '¡Gracias por tu interés! Tu solicitud ha sido enviada. El admin te contactará pronto.',
      participation: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get all participation requests (admin only)
export const getAllParticipations = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let queryText = 'SELECT * FROM participations WHERE 1=1';
    const queryParams = [];

    if (status) {
      queryParams.push(status);
      queryText += ` AND status = $${queryParams.length}`;
    }

    queryText += ' ORDER BY created_at DESC';

    const offset = (page - 1) * limit;
    queryParams.push(limit * 1);
    queryText += ` LIMIT $${queryParams.length}`;

    queryParams.push(offset);
    queryText += ` OFFSET $${queryParams.length}`;

    const result = await pool.query(queryText, queryParams);

    // Get total count
    const countResult = status
      ? await pool.query('SELECT COUNT(*) FROM participations WHERE status = $1', [status])
      : await pool.query('SELECT COUNT(*) FROM participations');

    res.json({
      success: true,
      participations: result.rows,
      totalPages: Math.ceil(countResult.rows[0].count / limit),
      currentPage: parseInt(page),
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
};

// Update participation status (admin only)
export const updateParticipationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // Determine status from the route if approve/reject endpoint
    if (req.path.endsWith('/approve')) {
      status = 'approved';
    } else if (req.path.endsWith('/reject')) {
      status = 'rejected';
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }

    const result = await pool.query(
      `UPDATE participations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Participación no encontrada'
      });
    }

    // TODO: Send email notification to participant about status change

    res.json({
      success: true,
      participation: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete participation request (admin only)
export const deleteParticipation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM participations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Participación no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Solicitud eliminada correctamente'
    });
  } catch (error) {
    next(error);
  }
};
