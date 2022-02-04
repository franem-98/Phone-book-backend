const request = require("supertest");
const moment = require("moment");
const { ObjectId } = require("mongoose").Types;
const { Sms } = require("../../models/sms");

let server;
const url = "/api/v1/smshistory/";

describe(url, () => {
  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Sms.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("Should get entire sms history", async () => {
      await Sms.insertMany([
        {
          number: "1234567890",
          message: "Blablabla",
          timestamp: "01/01/2022 16:30",
        },
        {
          number: "0987654321",
          message: "Blablabla",
          timestamp: "01/02/2022 16:30",
        },
      ]);

      const res = await request(server).get(url);

      expect(res.status).toBe(200);
      expect(
        res.body.find((sms) => sms.timestamp === "01/01/2022 16:30")
      ).toBeTruthy();
      expect(
        res.body.find((sms) => sms.timestamp === "01/02/2022 16:30")
      ).toBeTruthy();
    });
  });

  describe("GET / :id", () => {
    let sms;
    let id;

    const exec = () => {
      return request(server).get(url + id);
    };

    beforeEach(async () => {
      sms = await Sms.create({
        number: "1234567890",
        message: "1234567890",
        timestamp: "01/01/2022 16:30",
      });
      id = sms._id;
    });

    it("Should return 200 and sms if id is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("number", sms.number);
      expect(res.body).toHaveProperty("message", sms.message);
      expect(res.body).toHaveProperty("timestamp", sms.timestamp);
    });

    it("Should return 404 if sms with id doesnt exist", async () => {
      id = ObjectId();

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
    let message;
    let timestamp;

    const exec = () => {
      return request(server).post(url).send({ number, message, timestamp });
    };

    beforeEach(async () => {
      number = "1234567890";
      message = "blablablabla";
      timestamp = new Date().toISOString();
    });

    it("Should return 400 if number is empty", async () => {
      number = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if number is less than 3 chars", async () => {
      number = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if number is more than 10 chars", async () => {
      number = "123456789010";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if message is empty", async () => {
      message = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if message is more than 255 chars", async () => {
      message = Array(260).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if timestamp is not in iso string format", async () => {
      timestamp = new Date().toString();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should save sms if it is valid", async () => {
      await exec();

      const sms = await Sms.findOne({ number, message });

      expect(sms).not.toBeNull();
    });

    it("Should return sms if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("number", number);
      expect(res.body).toHaveProperty("message", message);
      expect(res.body).toHaveProperty(
        "timestamp",
        moment(timestamp).format("DD/MM/YYYY HH:mm").toString()
      );
    });
  });

  describe("DELETE / :id", () => {
    let id;
    let sms;

    const exec = () => {
      return request(server).delete(url + id);
    };

    beforeEach(async () => {
      sms = await Sms.create({
        number: "1234567890",
        message: "rftghjkzghuij",
        timestamp: "01/01/2022 16:30",
      });

      id = sms._id;
    });

    it("Should return 404 if sms with id doesnt exist", async () => {
      id = ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should delete sms if id is valid", async () => {
      await exec();

      const sms = await Sms.findById(id);

      expect(sms).toBeNull();
    });

    it("Should return sms if id is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("number", sms.number);
      expect(res.body).toHaveProperty("message", sms.message);
      expect(res.body).toHaveProperty("timestamp", sms.timestamp);
    });
  });
});
