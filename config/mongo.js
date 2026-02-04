const { MongoClient } = require("mongodb");
require("dotenv").config();
const { logger } = require("../logger");

const URL = process.env.MONGO_CONNECTION_STRING;
console.log(URL);
let db;
async function connect() {
  try {
    if (!URL) {
      logger.info("not able to fetch connection string of mongodb.");
      process.exit(1);
    }
    const client = new MongoClient(URL, {
      maxPoolSize: 20,
      minPoolSize: 10,
    });
    await client.connect();
    db = client.db("users");
    logger.info("mongodb connection is successfull.");
    return db;
  } catch (error) {
    throw new Error(error);
  }
}
async function getDB() {
  try {
    if (!db) {
      db = await connect();
    }
    logger.info("access to database is successful.");
    return db;
  } catch (error) {
    throw new Error(error);
  }
}
module.exports = { connect, getDB };
