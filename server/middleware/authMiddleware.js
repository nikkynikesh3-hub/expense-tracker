// ==========================================
// authMiddleware.js
// Protects routes: only logged-in users can pass.
// The user must send the token in the request header:
//   Authorization: Bearer <token>
// ==========================================

const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  // 1. Read the Authorization header sent by the user
  const authHeader = req.headers.authorization;

  // 2. No header, or it does not start with "Bearer " -> not logged in
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not logged in" });
  }

  // 3. Take the token part (the text after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 4. Check the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    // 5. Remember who the user is, so routes can use req.userId
    req.userId = decoded.id;

    // 6. Let the request continue to the route
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = protect;