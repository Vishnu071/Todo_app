const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
      console.log("Admin user already exists");
      return mongoose.disconnect();
    }

    const newUser = await User.create({
      username: "admin",
      password: "adminpass", // use bcrypt if your login hashes passwords
      isAdmin: true,
    });

    console.log("✅ Admin user created:", newUser);
    mongoose.disconnect();
  })
  .catch((err) => console.error("DB error:", err));
