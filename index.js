const express = require("express");
const { rateLimit } = require("express-rate-limit");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();
const basicRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { msg: "Too many requests, try again after some time." },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use(basicRateLimiter);
app.use(express.json());
app.get("/", (req, res, next) => {
  res.json({ data: "ok" });
});
app.use((req, res, next) => {
  res.status(404).json({ data: "The page is not found" });
});
app.listen(PORT, () => {
  console.log(`The user service is running on the port: ${PORT}`);
});
