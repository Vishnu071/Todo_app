const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Plain text comparison (for now)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ✅ Generate token with isAdmin embedded
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin, // Embed admin status into the token
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
