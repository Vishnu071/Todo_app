require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const username = "admin";
    const password = "yourNewPassword123"; // 🔐 Set your new password here

    await User.deleteOne({ username }); // Delete old admin user

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      username,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log(`✅ Admin user reset: ${username} / ${password}`);
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

resetAdmin();
