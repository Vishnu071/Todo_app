// todo_backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isAdmin) {
      return res.status(401).json({ message: "Not an admin" });
    }

    const token = jwt.sign({ id: user._id }, "yourSecretKey", {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
