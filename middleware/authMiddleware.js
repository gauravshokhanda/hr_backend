require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET, // Use the same environment variable for the secret
    (err, decodedToken) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        } else {
          return res.status(403).json({ message: "Invalid token" });
        }
      }

      req.user = decodedToken;
      next();
    }
  );
}

module.exports = authenticateToken;
