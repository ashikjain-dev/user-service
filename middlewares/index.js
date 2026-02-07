const { validateSignup, validateSignin } = require("./validate");
const { authenticate } = require("./auth");
const { errorHandler } = require("./error");
module.exports = { validateSignup, validateSignin, authenticate, errorHandler };
