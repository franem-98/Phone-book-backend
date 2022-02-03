const request = require("supertest");
const mongoose = require("mongoose");
const { serverFunction } = require("../../index");
const { Call } = require("../../models/call");

let server;

describe("/api/v1/callhistory", () => {
  beforeEach(async () => {
    await Call.deleteMany({});
    server = serverFunction(0);
  });

  afterEach(async () => {
    await server.close();
  });

  describe("GET /", async () => {
    it("Should get entire call history", async () => {
      await Call.insertMany([
        {
          number: "1234567890",
          duration: 5,
          endTime: new Date().toISOString(),
        },
        {
          number: "0987654321",
          duration: 4,
          endTime: new Date().toISOString(),
        },
      ]);

      const res = await request(server).get("/api/v1/callhistory");

      expect(res.status).toBe(200);
      expect(res.body.find((c) => (c.number = "1234567890"))).toBeTruthy();
      expect(res.body.find((c) => (c.number = "0987654321"))).toBeTruthy();
    });
  });

  describe("GET / :id", async () => {
    let call;
    let id;

    beforeEach(async () => {
      call = await Call.create({
        number: "1234567890",
        duration: 5,
        endTime: new Date().toISOString(),
      });

      id = call._id;
    });
    it("Should return 404 if call with id doesnt exist");
  });
});
