// ==========================================
// Expense.js
// Describes what one expense looks like in MongoDB.
// ==========================================

const mongoose = require("mongoose");

// The categories used for the chart later
const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Health", "Other"];

const expenseSchema = new mongoose.Schema(
  {
    // Which user owns this expense (links to the User model)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, trim: true },

    // Money spent. Must be more than zero.
    amount: { type: Number, required: true, min: 0.01 },

    category: { type: String, enum: CATEGORIES, default: "Other" },

    // The day of the expense. Defaults to today.
    date: { type: Date, default: Date.now },
  },
  // Adds createdAt and updatedAt automatically
  { timestamps: true }
);

// Mongoose saves these in a collection named "expenses"
module.exports = mongoose.model("Expense", expenseSchema);