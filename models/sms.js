const mongoose = require("mongoose");
const Joi = require("joi");

const smsSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
    match: /^[0-9]+$/,
  },
  message: {
    type: String,
    required: true,
    max: 255,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const validateSms = (sms) => {
  const schema = Joi.object({
    number: Joi.string()
      .required()
      .min(3)
      .max(10)
      .pattern(/^[0-9]+$/),
    message: Joi.string().required().max(255),
    timestamp: Joi.date().iso().required(),
  });

  return schema.validate(sms);
};

const Sms = mongoose.model("Sms", smsSchema);

module.exports = { Sms, validateSms };
