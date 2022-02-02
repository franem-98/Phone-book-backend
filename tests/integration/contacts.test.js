const request = require("supertest");
const mongoose = require("mongoose");
const { server: serverFunction } = require("../../index");
const { Contact } = require("../../models/contact");

let server;

describe("/api/v1/contacts", () => {
  beforeEach(async () => {
    await Contact.deleteMany({});
    server = serverFunction(0);
  });

  afterEach(async () => {
    await server.close();
  });

  describe("GET /", () => {
    it("Should return all contacts with status 200", async () => {
      await Contact.insertMany([
        {
          firstName: "Frane",
          lastName: "Franic",
          number: "1234567891",
        },
        {
          firstName: "Danko",
          lastName: "Dankovic",
          number: "1234567890",
        },
      ]);

      const res = await request(server).get("/api/v1/contacts");

      expect(res.status).toBe(200);
      expect(res.body.find((c) => c.firstName === "Frane")).toBeTruthy();
      expect(res.body.find((c) => c.firstName === "Danko")).toBeTruthy();
    });
  });

  describe("GET / :id", () => {
    it("Should return contact with status code 200 if valid id is passed", async () => {
      const contact = new Contact({
        firstName: "Frane",
        lastName: "Franic",
        number: "1234567890",
      });

      await contact.save();

      const res = await request(server).get("/api/v1/contacts/" + contact._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("firstName", contact.firstName);
    });

    it("Should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/v1/contacts/" + 1);

      expect(res.status).toBe(404);
    });

    it("Should return 404 if contact with given id doesnt exist", async () => {
      const contactId = mongoose.Types.ObjectId();

      const res = await request(server).get("/api/v1/contacts/" + contactId);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("Should return 400 if name is empty", async () => {
      const res = await await request(server)
        .post("/api/v1/contacts")
        .send({ firstName: "", number: "1234567890" });

      expect(res.status).toBe(400);
    });
  });
});
