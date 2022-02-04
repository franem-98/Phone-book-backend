const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { Sms } = require("../../models/sms");

let server;

describe("/api/v1/smshistory", () => {
  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Sms.deleteMany({});
    await server.close();
  });
});
