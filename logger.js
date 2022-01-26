const { ExceptionHandler } = require("winston");
const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./errors/log.log",
      level: "error",
    }),
  ],
});

module.exports = logger;
