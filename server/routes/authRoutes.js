// ==========================================
// authRoutes.js
// Signup (register) route. Login will be added here later.
// ==========================================

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Rule kept at the top so it is easy to change
const MIN_PASSWORD_LENGTH = 6;

// POST /api/auth/register
// The user sends: name, email, password
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check 1: every field must be filled in
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check 2: very short passwords are easy to guess
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    // Clean the email first, so "Test@Mail.com " matches "test@mail.com"
    const cleanEmail = email.trim().toLowerCase();

    // Check 3: one account per email
    const emailAlreadyUsed = await User.findOne({ email: cleanEmail });
    if (emailAlreadyUsed) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password so a database leak does not expose real passwords
    // (10 = how many rounds of scrambling; higher is safer but slower)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
    });

    // Send back only safe details. Never send the password back.
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    // Log the real reason for us; show a simple message to the user
    console.log("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;