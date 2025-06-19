// todo_backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// ✅ Export the model properly
module.exports = mongoose.model("User", UserSchema);
