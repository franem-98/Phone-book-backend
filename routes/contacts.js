const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const { validateContact } = require("../models/contact");
const validateId = require("../middleware/validateObjectId");
const validateNumber = require("../middleware/validateNumber");
const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contacts");

router
  .route("/")
  .get(getAllContacts)
  .post([validateNumber, validator(validateContact)], createContact);
router
  .route("/:id")
  .get(validateId, getContact)
  .patch(updateContact)
  .delete(deleteContact);

module.exports = router;
