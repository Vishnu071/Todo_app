const express = require("express");
const { check, validationResult, query } = require("express-validator");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");

const router = express.Router();

// Constants for pagination limits
const MAX_PAGE_SIZE = 50;

// Middleware to validate pagination and filters on GET /api/tasks
const validateGetTasks = [
  query("status").optional().isIn(["Pending", "In Progress", "Completed"]),
  query("priority").optional().isIn(["Low", "Medium", "High"]),
  query("category").optional().isString().trim().escape(),
  query("tag").optional().isString().trim().escape(),
  query("search").optional().isString().trim().escape(),
  query("dateFrom").optional().isISO8601().toDate(),
  query("dateTo").optional().isISO8601().toDate(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be an integer greater than 0"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: MAX_PAGE_SIZE })
    .toInt()
    .withMessage(`Limit must be an integer between 1 and ${MAX_PAGE_SIZE}`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// Validation middleware for task create/update
const validateTask = [
  check("title").exists().trim().notEmpty().withMessage("Title is required"),
  check("description").optional().isString().trim(),
  check("priority").optional().isIn(["Low", "Medium", "High"]),
  check("status").optional().isIn(["Pending", "In Progress", "Completed"]),
  check("deadline")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Deadline must be a valid date"),
  check("categories").optional().isArray(),
  check("categories.*").isString().trim(),
  check("tags").optional().isArray(),
  check("tags.*").isString().trim(),
  check("assignees").optional().isArray(),
  check("assignees.*")
    .isMongoId()
    .withMessage("Assignee IDs must be valid Mongo IDs"),
  check("recurring.interval")
    .optional()
    .isIn(["Daily", "Weekly", "Monthly", "Yearly"])
    .withMessage("Invalid recurring interval"),
  check("recurring.nextOccurrence")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Next occurrence must be a valid date"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// Placeholder for role-based authorization middleware (if collaborative features implemented)
// const authorizeTaskAccess = (req, res, next) => {
//   // Check user permissions to access/modify this task
//   next();
// };

router.use(auth);

// GET /api/tasks with advanced filters and pagination
router.get("/", validateGetTasks, getTasks);

// POST /api/tasks with validation
router.post("/", validateTask, createTask);

// PUT /api/tasks/:id with validation, optional authorization
router.put("/:id", validateTask, updateTask);

// DELETE /api/tasks/:id with optional authorization
router.delete("/:id", deleteTask);

module.exports = router;
