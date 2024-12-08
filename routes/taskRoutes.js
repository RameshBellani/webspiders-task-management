
// File: routes/taskRoutes.js
const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Task = require('../models/Task');

const router = express.Router();

// Validation middleware
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /tasks
router.post(
  '/',
  validate([
    body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title must not exceed 100 characters'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional().isISO8601().toDate(),
  ]),
  async (req, res, next) => {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const task = new Task({ title, description, status, priority, dueDate });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// GET /tasks
router.get(
  '/',
  validate([
    query('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED']),
    query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    query('sort').optional().isIn(['createdAt', 'dueDate']),
    query('order').optional().isIn(['asc', 'desc']),
    query('limit').optional().isInt({ min: 1 }),
    query('skip').optional().isInt({ min: 0 }),
  ]),
  async (req, res, next) => {
    try {
      const { status, priority, sort = 'createdAt', order = 'asc', limit = 10, skip = 0 } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (priority) filter.priority = priority;

      const tasks = await Task.findNotDeleted(filter)
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  }
);

// GET /tasks/:id
router.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid task ID')]),
  async (req, res, next) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, deletedAt: null });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /tasks/:id
router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().isLength({ max: 100 }).withMessage('Title must not exceed 100 characters'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional().isISO8601().toDate(),
  ]),
  async (req, res, next) => {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { title, description, status, priority, dueDate, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /tasks/:id
router.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid task ID')]),
  async (req, res, next) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, deletedAt: null });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      await task.softDelete();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
