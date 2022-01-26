const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const validateId = require("../middleware/validateObjectId");
const { validateCall } = require("../models/call");
const {
  getCallHistory,
  getCall,
  createCall,
  deleteCall,
} = require("../controllers/callHistory");

router.route("/").get(getCallHistory).post(validator(validateCall), createCall);
router.route("/:id").get(validateId, getCall).delete(deleteCall);

module.exports = router;
