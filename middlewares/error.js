const { logger } = require("../logger");

/**
 * Global Error Handling Middleware
 * Standardizes error responses across the service.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    // Log the error
    logger.error(message, {
        statusCode,
        url: req.originalUrl,
        method: req.method,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    // Standardized Error Response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        },
    });
};

module.exports = { errorHandler };
