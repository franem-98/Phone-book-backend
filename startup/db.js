const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../logger");

module.exports = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    logger.info("Connected to database...");
  });
};
