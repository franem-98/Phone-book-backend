const express = require("express");
const logger = require("./logger");

const app = express();

require("./startup/cors")(app);
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/compress")(app);

const port = process.env.PORT || 5000;

const server = (port) => {
  return app.listen(
    port,
    logger.info(`Server is listening on port ${port}...`)
  );
};

server(port);

exports.serverFunction = server;
