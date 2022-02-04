const request = require("supertest");
const { ObjectId } = require("mongoose").Types;
const { Contact } = require("../../models/contact");

let server;
const url = "/api/v1/contacts/";

describe(url, () => {
  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Contact.deleteMany({});
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

      const res = await request(server).get(url);

      expect(res.status).toBe(200);
      expect(res.body.find((c) => c.firstName === "Frane")).toBeTruthy();
      expect(res.body.find((c) => c.firstName === "Danko")).toBeTruthy();
    });
  });

  describe("GET / :id", () => {
    let id;

    const exec = () => {
      return request(server).get(url + id);
    };

    it("Should return contact with status code 200 if valid id is passed", async () => {
      const contact = await Contact.create({
        firstName: "Frane",
        lastName: "Franic",
        number: "1234567890",
      });

      id = contact._id;

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("firstName", "Frane");
    });

    it("Should return 404 if invalid id is passed", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 404 if contact with given id doesnt exist", async () => {
      id = ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let firstName;
    let number;

    const exec = () => {
      return request(server).post(url).send({ firstName, number });
    };

    beforeEach(() => {
      firstName = "Frane";
      number = "1234567890";
    });

    it("Should return 400 if firstName is empty", async () => {
      firstName = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if firstName is longer than 50 chars", async () => {
      firstName = Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 409 if number already exists in db", async () => {
      await Contact.create({ firstName: "Ante", number });

      const res = await exec();

      expect(res.status).toBe(409);
    });

    it("Should save the contact if it is valid", async () => {
      await exec();

      const contact = Contact.find({ firstName, number });

      expect(contact).not.toBeNull;
    });

    it("Should return the contact if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("firstName", firstName);
      expect(res.body).toHaveProperty("number", number);
    });
  });

  describe("PATCH / :id", () => {
    let id;
    let newFirstName;
    let newNumber;
    let contact;
    const existingNumber = "1234567890";

    const exec = () => {
      return request(server)
        .patch(url + id)
        .send({ firstName: newFirstName, number: newNumber });
    };

    beforeEach(async () => {
      contact = await Contact.create({
        firstName: "Frane",
        number: existingNumber,
      });

      id = contact._id;
      newFirstName = "Updated name";
      newNumber = "0987654321";
    });

    it("Should return 400 if new firstName is empty.", async () => {
      newFirstName = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if new firstName is more than 50 chars.", async () => {
      newFirstName = Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 404 if contact is not found", async () => {
      id = ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 409 if contact with new number already exists", async () => {
      newNumber = existingNumber;

      const res = await exec();

      expect(res.status).toBe(409);
    });

    it("Should update the contact if input is valid", async () => {
      await exec();

      const updatedContact = await Contact.findOne({
        firstName: newFirstName,
        number: newNumber,
      });

      expect(updatedContact.firstName).toBe(newFirstName);
    });

    it("Should return the contact if input is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("firstName", newFirstName);
      expect(res.body).toHaveProperty("number", newNumber);
    });
  });

  describe("DELETE / :id", () => {
    let id;
    let contact;

    const exec = () => {
      return request(server).delete("/api/v1/contacts/" + id);
    };

    beforeEach(async () => {
      contact = await Contact.create({
        firstName: "Frane",
        number: "1234567890",
      });

      id = contact._id;
    });

    it("Should return 404 if contact with id doesnt exist", async () => {
      id = ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should delete selected contact if input is valid", async () => {
      await exec();

      const deletedContact = await Contact.findById(id);

      expect(deletedContact).toBeNull();
    });

    it("Should return deleted contact if input is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("firstName", contact.firstName);
      expect(res.body).toHaveProperty("number", contact.number);
    });
  });
});
