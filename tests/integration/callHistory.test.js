const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { Call } = require("../../models/call");

let server;

describe("/api/v1/callhistory", () => {
  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Call.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
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

  describe("GET / :id", () => {
    let call;
    let number;
    let endTime;
    let id;

    const exec = () => {
      return request(server).get("/api/v1/callhistory/" + id);
    };

    beforeEach(async () => {
      number = "1234567890";
      endTime = new Date().toISOString();
      call = await Call.create({
        number,
        duration: 5,
        endTime,
      });

      id = call._id;
    });

    it("Should return call and 200 if valid id is passed", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("number", "1234567890");
      expect(res.body).toHaveProperty("duration", 5);
      expect(res.body).toHaveProperty("endTime", endTime);
    });

    it("Should return 404 if call with id doesnt exist", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let number;
    let duration;
    let endTime;

    const exec = () => {
      return request(server)
        .post("/api/v1/callhistory")
        .send({ number, duration, endTime });
    };

    beforeEach(() => {
      number = "1234567890";
      duration = 5;
      endTime = new Date().toISOString();
    });

    it("Should return 400 if number is empty.", async () => {
      number = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if number is less than 3 digits.", async () => {
      number = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if number is more than 10 digits.", async () => {
      number = "12345678901010";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if duration is empty.", async () => {
      duration = null;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if duration is not a number.", async () => {
      duration = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if endTime is not iso string", async () => {
      endTime = new Date().toString();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should save the call if it is valid", async () => {
      await exec();

      const call = await Call.findOne({ number });

      expect(call).not.toBeNull();
    });

    it("Should return the call if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("number", number);
      expect(res.body).toHaveProperty("duration", duration);
      expect(res.body).toHaveProperty(
        "endTime",
        moment(endTime).format("DD/MM/YYYY HH:mm").toString()
      );
    });
  });

  describe("DELETE / :id", () => {
    let call;
    let id;

    const exec = () => {
      return request(server).delete("/api/v1/callhistory/" + id);
    };

    beforeEach(async () => {
      call = await Call.create({
        number: "1234567890",
        duration: 5,
        endTime: "01/01/2022 16:30",
      });

      id = call._id;
    });

    it("Should return 404 if call with id doesnt exist", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should delete call if it is valid", async () => {
      await exec();

      const call = await Call.findById(id);

      expect(call).toBeNull();
    });

    it("Should return call if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("number", call.number);
      expect(res.body).toHaveProperty("duration", call.duration);
      expect(res.body).toHaveProperty("endTime", call.endTime);
    });
  });
});
