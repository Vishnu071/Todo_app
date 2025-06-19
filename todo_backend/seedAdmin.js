require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

(async () => {
  try {
    console.log("🔁 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const username = "admin";
    const password = "admin123";

    const deleted = await User.deleteOne({ username });
    console.log(`🧹 Deleted admin (${deleted.deletedCount} user)`);

    const newAdmin = new User({
      username,
      password,
      isAdmin: true,
    });

    await newAdmin.save();
    console.log(`✅ Admin user created: ${username} / ${password}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  }
})();
