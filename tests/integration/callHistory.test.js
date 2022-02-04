const request = require("supertest");
const moment = require("moment");
const { ObjectId } = require("mongoose").Types;
const { Call } = require("../../models/call");

let server;
const url = "/api/v1/callhistory/";

describe(url, () => {
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
          endTime: "01/01/2022 16:30",
        },
        {
          number: "0987654321",
          duration: 4,
          endTime: "01/02/2022 16:30",
        },
      ]);

      const res = await request(server).get(url);

      expect(res.status).toBe(200);
      expect(res.body.find((c) => (c.number = "1234567890"))).toBeTruthy();
      expect(res.body.find((c) => (c.number = "0987654321"))).toBeTruthy();
    });
  });

  describe("GET / :id", () => {
    let call;
    let id;

    const exec = () => {
      return request(server).get(url + id);
    };

    beforeEach(async () => {
      call = await Call.create({
        number: "1234567890",
        duration: 5,
        endTime: "01/01/2022 16:30",
      });

      id = call._id;
    });

    it("Should return call and 200 if valid id is passed", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("number", call.number);
      expect(res.body).toHaveProperty("duration", call.duration);
      expect(res.body).toHaveProperty("endTime", call.endTime);
    });

    it("Should return 404 if call with id doesnt exist", async () => {
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
    let duration;
    let endTime;

    const exec = () => {
      return request(server).post(url).send({ number, duration, endTime });
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
      return request(server).delete(url + id);
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
      id = ObjectId();

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
