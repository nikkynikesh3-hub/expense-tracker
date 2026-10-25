// ==========================================
// authRoutes.js
// Signup (register) and login routes.
// ==========================================

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Rules kept at the top so they are easy to change
const MIN_PASSWORD_LENGTH = 6;
const TOKEN_VALID_FOR = "7d"; // the user stays logged in for 7 days

// ------------------------------------------
// POST /api/auth/register
// The user sends: name, email, password
// ------------------------------------------
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

    // Clean the email, so "Test@Mail.com " matches "test@mail.com"
    const cleanEmail = email.trim().toLowerCase();

    // Check 3: one account per email
    const emailAlreadyUsed = await User.findOne({ email: cleanEmail });
    if (emailAlreadyUsed) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Scramble the password so real passwords are never saved
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
    });

    // Send back only safe details, never the password
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.log("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------------
// POST /api/auth/login
// The user sends: email, password
// If both are correct, we send back a token.
// ------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check 1: both fields must be filled in
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user with this email
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    // Same message for "no user" and "wrong password",
    // so nobody can find out which emails are registered
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the typed password with the scrambled one in the database
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create the token. It holds the user's id and expires after 7 days.
    // The JWT_SECRET from .env signs it, so nobody can fake it.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_VALID_FOR,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;