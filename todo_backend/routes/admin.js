const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const adminAuth = require("../middleware/admin");

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Promote user to admin
router.put("/users/promote/:id", adminAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: true },
    { new: true }
  );
  res.json(user);
});

// Edit user
router.put("/users/:id", adminAuth, async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { username, password },
    { new: true }
  );
  res.json(user);
});

// Delete user
router.delete("/users/:id", adminAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// Get all tasks
router.get("/tasks", adminAuth, async (req, res) => {
  const tasks = await Task.find().populate("userId", "username");
  res.json(tasks);
});

// Delete task
router.delete("/tasks/:id", adminAuth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;
