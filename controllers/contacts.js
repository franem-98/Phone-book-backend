const Contact = require("../models/contact");
const asyncWrapper = require("../middleware/async");

const noContactFoundMsg = (id) => {
  return `No contact with id: ${id} exists.`;
};

const getAllContacts = asyncWrapper(async (req, res, next) => {
  const contacts = await Contact.find({});
  res.status(200).send(contacts);
});

const createContact = asyncWrapper(async (req, res, next) => {
  const contact = await Contact.create(req.body);
  res.status(201).send(contact);
});

const getContact = asyncWrapper(async (req, res, next) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId });

  if (!contact) {
    return res.status(404).send(noContactFoundMsg(contactId));
  }

  res.status(200).send(contact);
});

const updateContact = asyncWrapper(async (req, res, next) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contact) {
    return res.status(404).send(noContactFoundMsg(contactId));
  }

  res.status(200).send(contact);
});

const deleteContact = asyncWrapper(async (req, res, next) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOneAndDelete({ _id: contactId });

  if (!contact) {
    return res.status(404).send(noContactFoundMsg(contactId));
  }

  res.status(200).send(contact);
});

module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
