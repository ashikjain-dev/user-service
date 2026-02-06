const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { getDB } = require("../config/mongo");
const { logger } = require("../logger");
const { publishEvent } = require("../events/publisher");
const {
  validateSignup,
  validateSignin,
  authenticate,
} = require("../middlewares/");
const { ObjectId } = require("mongodb");
const userRoute = express.Router();
const JWT_KEY = process.env.JSONWEBTOKEN_KEY;
userRoute.post("/signup", validateSignup, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const db = await getDB();
    //check if email is already exists or not before signing up
    const isUserEmailExist = await db
      .collection("users")
      .findOne({ email: email });
    if (isUserEmailExist) {
      res.status(409).json({ data: "user email is already exist" });
      logger.http("user email is already exist", {
        status: res.statusCode,
        email,
      });
      return;
    }
    //hash the password before storing the database.
    const hashPassword = await bcrypt.hash(password, 12);
    const resFromDB = await db
      .collection("users")
      .insertOne({ firstName, lastName, email, password: hashPassword });
    const payload = { userId: new ObjectId(resFromDB.insertedId) };
    const token = jwt.sign(payload, JWT_KEY, { expiresIn: "30m" });
    res.cookie("token", token, { maxAge: 30 * 60 * 1000 });
    res.status(201).json({ data: resFromDB });

    //publish the event
    publishEvent({
      type: "USER_SIGNED_UP",
      payload: {
        email,
        firstName,
      },
    });
    logger.http("user signup is completed", {
      data: resFromDB,
      status: res.statusCode,
    });
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.error(error.message, {
      fullmessage: error,
    });
  }
});

userRoute.get("/view", authenticate, async (req, res, next) => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(400).json({ data: "user data not found" });
      logger.info("user id is not found in the token", {
        userId: req.id,
      });
      return;
    }
    const db = await getDB();
    const userInfo = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!userInfo) {
      res.status(400).json({ data: "user data not found" });
      logger.info("user data not found in the mongodb", {
        userId: req.id,
      });
      return;
    }
    res.json({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
    });
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.error(error.message, {
      fullmessage: error.stack,
    });
  }
});

userRoute.post("/signin", validateSignin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = await getDB();
    //check if email is already exists before comparing the password
    const isUserExist = await db.collection("users").findOne({ email });
    if (!isUserExist) {
      res.status(401).json({ data: "email or password is not correct." });
      logger.http("user email is not found in the database", {
        status: res.statusCode,
        email,
      });
      return;
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist.password,
    );
    if (!isPasswordMatched) {
      res.status(401).json({ data: "email or password is not correct." });
      logger.http("email or password is not correct", {
        status: res.statusCode,
      });
      return;
    }
    const payload = { userId: new ObjectId(isUserExist._id) };
    const token = jwt.sign(payload, JWT_KEY, { expiresIn: "30m" });
    res.cookie("token", token, { maxAge: 30 * 60 * 1000 });
    res.json({ data: "successfully logged in" });
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.error(error.message, {
      fullmessage: error,
    });
  }
});

userRoute.get("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      data: "Successfully logged out",
    });
  } catch (error) {
    res.status(500).json({ data: "something went wrong" });
    logger.error(error.message, {
      stack: error.stack,
    });
  }
});
module.exports = { userRoute };
