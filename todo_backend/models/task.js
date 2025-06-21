const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    deadline: Date,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    categories: [{ type: String }],
    tags: [{ type: String }],
    comments: [commentSchema],
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    recurring: {
      interval: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "Yearly"],
        default: null,
      },
      nextOccurrence: Date,
    },
  },
  {
    timestamps: true,
    collection: "tasks",
  }
);

module.exports = mongoose.model("Task", taskSchema);
