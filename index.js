const express = require("express");
const { rateLimit } = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const { logger } = require("./logger");
const { connect } = require("./config/mongo");
const { userRoute } = require("./routes/user");
const { errorHandler } = require("./middlewares/");
const PORT = process.env.PORT;
const app = express();
const basicRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { msg: "Too many requests, try again after some time." },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use(basicRateLimiter);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  logger.http("Request Received:", {
    url: req.originalUrl,
    method: req.method,
  });
  next();
});
app.use("/api/v1/users", userRoute);
app.get("/health", (req, res, next) => {
  res.status(200).json({ data: "ok,healthy!" });
});
app.get("/", (req, res, next) => {
  res.json({ data: "ok" });
});
// 404 handler
app.use((req, res, next) => {
  const error = new Error("The page is not found");
  error.statusCode = 404;
  next(error);
});
// Global Error Handler
app.use(errorHandler);
connect()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`The server is running on the port:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error.message, {
      stack: error.stack,
    });
    process.exit(0);
  });
