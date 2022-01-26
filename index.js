const express = require("express");
const app = express();
const contacts = require("./starter/routes/contacts");
const callHistory = require("./starter/routes/callHistory");
const smsHistory = require("./starter/routes/smsHistory");
const notFound = require("./starter/middleware/not-found");
const error = require("./starter/middleware/error");
const connectToDb = require("./starter/db/connect");
require("dotenv").config();

app.use(express.json());

app.use("/api/v1/contacts", contacts);
app.use("/api/v1/callhistory", callHistory);
app.use("/api/v1/smshistory", smsHistory);
app.use(notFound);
app.use(error);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectToDb(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
