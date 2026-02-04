const { validateSignup, validateSignin } = require("./validate");
const { authenticate } = require("./auth");
module.exports = { validateSignup, validateSignin, authenticate };
