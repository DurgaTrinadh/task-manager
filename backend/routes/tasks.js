const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

const emit = (req, event, data) => {
  if (req.io) req.io.to(req.user._id.toString()).emit(event, data);
};

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const uid = req.user._id;
    const [total, todo, inprogress, done] = await Promise.all([
      Task.countDocuments({ user: uid }),
      Task.countDocuments({ user: uid, status: 'todo' }),
      Task.countDocuments({ user: uid, status: 'inprogress' }),
      Task.countDocuments({ user: uid, status: 'done' })
    ]);
    res.json({ total, todo, inprogress, done });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    emit(req, 'task:created', task);
    res.status(201).json({ task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    emit(req, 'task:updated', task);
    res.json({ task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    emit(req, 'task:deleted', { id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;