const Task = require("../models/task");

// GET /api/tasks?status=...&priority=...
const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      tag,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { userId: req.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.categories = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const skip = (page - 1) * limit;
    const tasks = await Task.find(filter)
      .sort({ deadline: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Task.countDocuments(filter);

    res.json({
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      userId: req.userId,
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Export all controller functions
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
