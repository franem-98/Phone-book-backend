const express = require("express");
const cors = require("cors");
const contacts = require("../routes/contacts");
const callHistory = require("../routes/callHistory");
const smsHistory = require("../routes/smsHistory");
const notFound = require("../middleware/not-found");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use("/api/v1/contacts", contacts);
  app.use("/api/v1/callhistory", callHistory);
  app.use("/api/v1/smshistory", smsHistory);
  app.use(notFound);
  app.use(error);
};
