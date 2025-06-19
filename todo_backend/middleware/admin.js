// middleware/admin.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Check for token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Look up the user by ID from the DB
    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.user = user; // Optional: make user available in the request
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(403).json({ message: "Token invalid or expired" });
  }
};
