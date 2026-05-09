import { projects } from '../db/query.js';
import pool from '../config/database.js';
import upload from '../middleware/upload.js';
import supabase from '../lib/supabase.js';
import Joi from 'joi';


export const getAllProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Use the projects.findAll query which properly filters is_active = true
    const result = await pool.query(
      `SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );

    const countResult = await pool.query(`SELECT COUNT(*) FROM projects WHERE is_active = true`);
    const count = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      projects: result.rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const adminCreateProject = async (req, res, next) => {
  // Multer upload middleware - handles multipart/form-data
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const createProjectSchema = Joi.object({
        title: Joi.string().min(3).max(200).required().label('Título'),
        description: Joi.string().min(10).max(2000).required().label('Descripción'),
        start_date: Joi.date().iso().required().label('Fecha inicio'),
        status: Joi.string().valid('Próximamente', 'En proceso', 'Completado').required().label('Estado'),
        beneficiaries: Joi.number().integer().min(1).required().label('Beneficiarios'),
        category: Joi.string().max(50).default('social').label('Categoría'),
        short_description: Joi.string().max(200).allow('').label('Descripción corta'),
        is_featured: Joi.alternatives().try(
          Joi.boolean(),
          Joi.string().valid('true', 'false')
        ).default(false).label('Destacado')
      });

      const { error: validationError, value: validatedData } = createProjectSchema.validate(req.body, { abortEarly: false });
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
      }

      const { title, description, start_date, status, beneficiaries, is_featured } = validatedData;

      let image_url = '';
      if (supabase && req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `projects/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

        if (error) {
          return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      const projectData = {
        title,
        description,
        start_date,
        status,
        beneficiaries: parseInt(beneficiaries),
        image: image_url,
        category: req.body.category || 'social',
        short_description: req.body.short_description || description.substring(0, 200),
        is_featured: is_featured === true || is_featured === 'true',
        is_active: true
      };

      const result = await projects.create(projectData);
      const project = result.rows[0];

      res.status(201).json({ success: true, project });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const adminUpdateProject = async (req, res, next) => {
  // First find the project
  try {
    const result = await projects.findById(req.params.id);
    const project = result.rows[0];

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Multer upload middleware - handles multipart/form-data
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        const updateProjectSchema = Joi.object({
          title: Joi.string().min(3).max(200).required().label('Título'),
          description: Joi.string().min(10).max(2000).required().label('Descripción'),
          start_date: Joi.date().iso().required().label('Fecha inicio'),
          status: Joi.string().valid('Próximamente', 'En proceso', 'Completado').required().label('Estado'),
          beneficiaries: Joi.number().integer().min(1).required().label('Beneficiarios'),
          category: Joi.string().max(50).label('Categoría'),
          short_description: Joi.string().max(200).label('Descripción corta'),
          is_featured: Joi.alternatives().try(
            Joi.boolean(),
            Joi.string().valid('true', 'false')
          ).label('Destacado')
        });

        const { error: validationError, value: validatedData } = updateProjectSchema.validate(req.body, { abortEarly: false });
        if (validationError) {
          return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
        }

        let image_url = project.image;

        // Update image if new file
        if (req.file) {
          const fileExt = req.file.originalname.split('.').pop();
          const fileName = `projects/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, req.file.buffer, {
              contentType: req.file.mimetype,
              upsert: true
            });

          if (error) {
            return res.status(500).json({ success: false, message: 'Image upload failed' });
          }

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

          image_url = publicUrl;
        }

        const projectData = {
          ...validatedData,
          image: image_url,
          beneficiaries: Number(validatedData.beneficiaries),
          is_active: project.is_active
        };

        const updateResult = await projects.update(req.params.id, projectData);
        const updatedProject = updateResult.rows[0];

        res.json({ success: true, project: updatedProject });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteProject = async (req, res, next) => {
  try {
    const result = await projects.findById(req.params.id);
    const project = result.rows[0];
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Soft delete
    await projects.delete(req.params.id);
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

