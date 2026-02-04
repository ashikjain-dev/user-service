const { createLogger, format, transports } = require("winston");
const timezoned = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata", // Example: Indian Standard Time
  });
};
const logger = createLogger({
  level: "http",
  format: format.combine(
    format.timestamp({ format: timezoned }),
    format.json(),
    format.prettyPrint(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./logs/all.log", level: "http" }),
    new transports.File({ filename: "./logs/error.log", level: "error" }),
  ],
});

module.exports = { logger };
