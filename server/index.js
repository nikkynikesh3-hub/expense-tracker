// ==========================================
// index.js
// Starting point of the backend.
// Connects to MongoDB, then starts the server.
// ==========================================

// Load secret values (like MONGO_URI) from the .env file.
// This must run before any code that uses process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");


const app = express();

// Middleware: runs on every request
app.use(cors());          // lets the React app (another address) call this server
app.use(express.json());  // lets the server read JSON sent by the user

// Test route: opening http://localhost:5000 shows this message
app.get("/", (req, res) => {
  res.send("API Running");
});



// Every route in authRoutes.js starts with /api/auth
// Example: /register becomes /api/auth/register
app.use("/api/auth", authRoutes);
app.use("/api/expenses",expenseRoutes);

// Hosting sites give their own port, so use theirs if it exists
const PORT = process.env.PORT || 5000;

// Connect to the database first, so the server never runs without it
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });