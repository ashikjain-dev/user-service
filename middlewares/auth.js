const jwt = require("jsonwebtoken");
require("dotenv").config();
const { logger } = require("../logger");
const JWT_SECRET_KEY = process.env.JSONWEBTOKEN_KEY;

const authenticate = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ data: "user is not authorized" });
      logger.info("no token found in the cookie");
      return;
    }
    const { userId } = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ data: "something went wrong." });
    logger.error(error.message, {
      info: error.stack,
    });
  }
};

module.exports = { authenticate };
