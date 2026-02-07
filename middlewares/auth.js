const jwt = require("jsonwebtoken");
require("dotenv").config();
const { logger } = require("../logger");
const JWT_SECRET_KEY = process.env.JSONWEBTOKEN_KEY;

const authenticate = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    const error = new Error("user is not authorized");
    error.statusCode = 401;
    throw error;
  }
  const { userId } = jwt.verify(token, JWT_SECRET_KEY);
  req.userId = userId;
  next();
};

module.exports = { authenticate };
