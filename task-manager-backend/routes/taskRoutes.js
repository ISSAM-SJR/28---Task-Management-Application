const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create Task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

// Get All Tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Search Tasks (must come before dynamic routes)
router.get('/search', async (req, res) => {
  const { status, title, sortBy } = req.query;
  const query = {};
  if (status) query.status = status;
  if (title) query.title = { $regex: title, $options: 'i' };

  let sortOption = {};
  if (sortBy === 'deadline') sortOption.deadline = 1;
  if (sortBy === 'priority') sortOption.priority = -1;

  const tasks = await Task.find(query).sort(sortOption);
  res.json(tasks);
});

// Get Task by ID
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// Update Task
router.put('/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// Delete Task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;