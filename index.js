const express = require("express");
const logger = require("./logger");

const app = express();

require("./startup/cors")(app);
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/compress")(app);

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  logger.info(`Server is listening on port ${port}...`)
);

module.exports = server;
