const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const validateId = require("../middleware/validateObjectId");
const { validateSms } = require("../models/sms");
const {
  getSmsHistory,
  getSms,
  createSms,
  deleteSms,
} = require("../controllers/smsHistory");

router.route("/").get(getSmsHistory).post(validator(validateSms), createSms);
router.route("/:id").get(validateId, getSms).delete(deleteSms);

module.exports = router;
