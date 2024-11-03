const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader.startsWith("Bearer"))
    return res.status(404).json({ msg: "Authentication failed" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(404).json({ msg: "Authentication failed" });

    req.userId = decoded.userId;
    next();
  });
};

module.exports = authMiddleware;
