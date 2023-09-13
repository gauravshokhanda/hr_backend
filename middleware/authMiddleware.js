require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("  w1");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(token, "token");
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.error("Token verification error:", err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else {
        return res.status(403).json({ message: "Invalid token" });
      }
    }

    req.user = decodedToken;
    next();
  });
}

module.exports = authenticateToken;
