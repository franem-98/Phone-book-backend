const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../logger");

const url = process.env.MONGO_URI;

module.exports = () => {
  mongoose.connect(url).then(() => {
    logger.info(`Connected to ${url}...`);
  });
};
