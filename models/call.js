const mongoose = require("mongoose");
const Joi = require("joi");

const callSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
    match: /^[0-9]+$/,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const validateCall = (call) => {
  const schema = Joi.object({
    number: Joi.string()
      .required()
      .min(3)
      .max(10)
      .pattern(/^[0-9]+$/),
    duration: Joi.number().integer().required().min(0),
    endTime: Joi.date().iso().required(),
  });

  return schema.validate(call);
};

const Call = mongoose.model("Call", callSchema);

module.exports = { Call, validateCall };
