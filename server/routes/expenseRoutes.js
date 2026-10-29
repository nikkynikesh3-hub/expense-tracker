// ==========================================
// expenseRoutes.js
// Add, list, edit and delete expenses.
// Every route is protected: the user must be logged in,
// and each user can only see and change their own expenses.
// ==========================================

const express = require("express");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// The guard runs before every route in this file
router.use(protect);

// Only these fields can be changed when editing an expense
const EDITABLE_FIELDS = ["title", "amount", "category", "date"];

// ------------------------------------------
// POST /api/expenses
// Add a new expense.
// The user sends: title, amount, category (optional), date (optional)
// ------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    // req.userId was set by the guard, so the expense belongs to this user
    const expense = await Expense.create({
      user: req.userId,
      title,
      amount,
      category,
      date,
    });

    res.status(201).json(expense);
  } catch (error) {
    // Schema rules broken (wrong category, amount below 0.01, and so on)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Add expense error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------------
// GET /api/expenses
// List all expenses of the logged-in user, newest first.
// ------------------------------------------
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.log("List expenses error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------------
// PUT /api/expenses/:id
// Edit one expense. Send only the fields you want to change.
// ------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Collect only the allowed fields that were actually sent
    const updates = {};
    EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Match the id AND the owner, so users cannot edit other people's expenses
    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Edit expense error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------------
// DELETE /api/expenses/:id
// Delete one expense.
// ------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const expense = await Expense.findOneAndDelete({ _id: id, user: req.userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.log("Delete expense error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;