const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/admin");

const app = express();

// === CORS Configuration ===
const corsOptions = {
  origin: ["http://127.0.0.1:5501", "https://todo-app-full-6.onrender.com"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

// Serve static files (frontend)
app.use(express.static("public"));

// Parse incoming JSON requests
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Todo Backend is running");
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    // === Scheduled Email Notifications ===
    const cron = require("node-cron");
    const Todo = require("./models/task");
    const User = require("./models/User");
    const { sendTaskReminder } = require("./utils/mailer");

    // Every 10 minutes, check for tasks due in the next hour
    cron.schedule("*/10 * * * *", async () => {
      const now = new Date();
      const soon = new Date(now.getTime() + 60 * 60 * 1000);

      // Find todos due soon and not completed
      const todos = await Todo.find({
        dueDate: { $gte: now, $lte: soon },
        completed: false,
      }).populate("user");

      for (const todo of todos) {
        const user = todo.user;
        if (!user || !user.email) continue;

        // Customize subject by priority
        let subject = `[${todo.priority}] Task Reminder: ${todo.title}`;
        if (todo.priority === "High")
          subject = `🚨 HIGH PRIORITY: ${todo.title} is due soon!`;
        if (todo.priority === "Medium")
          subject = `⏰ Reminder: ${todo.title} (Medium Priority)`;
        if (todo.priority === "Low")
          subject = `Reminder: ${todo.title} (Low Priority)`;

        let text = `Hi ${user.username || user.email},\n\nYour task "${
          todo.title
        }" (Priority: ${todo.priority}) is due at ${
          todo.dueDate
        }.\n\nDescription: ${todo.description}\n\n- Todo App`;

        await sendTaskReminder(user.email, subject, text);
      }
    });
    // === End Scheduled Email Notifications ===
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });
