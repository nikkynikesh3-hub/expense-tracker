// ==========================================
// User.js
// Describes what a user looks like in MongoDB.
// ==========================================

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // unique: no two users can share one email
    // lowercase: "A@x.com" and "a@x.com" count as the same email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Stored as a scrambled (hashed) value, never as plain text
    password: { type: String, required: true },
  },
  // Adds createdAt and updatedAt automatically
  { timestamps: true }
);

// Mongoose saves these users in a collection named "users"
module.exports = mongoose.model("User", userSchema);