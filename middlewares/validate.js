const validator = require("validator");
const { logger } = require("../logger");
const validateSignup = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName) {
    res.status(400).json({
      data: "mandatory fields are: email, password and firstName.",
    });
    return;
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ data: "give proper email." });
    return;
  }
  if (!validator.isStrongPassword(password)) {
    res.status(400).json({
      data: "password must contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    });
    return;
  }
  if (validator.isEmpty(firstName) || String(firstName).length > 10) {
    res.status(400).json({
      data: "first Name must contain at least one character and less than 10 characters",
    });
    return;
  }
  if (!isNaN(lastName) || String(lastName).length > 10) {
    res.status(400).json({
      data: "last name must contain at least one character and less than 10 characters",
    });
    return;
  }
  if (!lastName) {
    req.body.lastName = "";
  }
  next();
};

const validateSignin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      data: "mandatory fields are: email and password.",
    });
    return;
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ data: "give proper email." });
    return;
  }
  if (!validator.isStrongPassword(password)) {
    res.status(400).json({
      data: "password must contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    });
    return;
  }
  next();
};
module.exports = { validateSignup, validateSignin };
