const axios = require("axios");
const { logger } = require("../logger");
const { error } = require("winston");
const NOTIFICATION_URL = process.env.NOTIFICATION_URL;
const publishEvent = async (event) => {
  try {
    if (!NOTIFICATION_URL) {
      logger.error(error.message, {
        stack: error.stack,
      });
    }
    logger.info("sending notification event");
    axios.post(`${NOTIFICATION_URL}/events`, event).catch((error) => {
      logger.error(error.message, {
        stack: error.stack,
      });
    });
  } catch (error) {
    logger.error(error.message, {
      stack: error.stack,
    });
  }
};

module.exports = { publishEvent };
