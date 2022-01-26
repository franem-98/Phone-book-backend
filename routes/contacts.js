const express = require("express");
const router = express.Router();
const validateId = require("../middleware/validateObjectId");
const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contacts");

router.route("/").get(getAllContacts).post(createContact);
router
  .route("/:id")
  .get(validateId, getContact)
  .patch(updateContact)
  .delete(deleteContact);

module.exports = router;
