const mongoose = require("mongoose");
const Joi = require("joi");

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Must provide first name."],
    trim: true,
    minlength: [1, "Name must be at least 1 character long."],
    maxlength: [50, "Name can not be longer than 50 characters."],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, "Name can not be longer than 50 characters."],
  },
  number: {
    type: String,
    required: [true, "Must provide number."],
    unique: true,
    trim: true,
    minlength: [3, "Number must be at least 3 characters long."],
    maxlength: [10, "Number can not be longer than 10 characters."],
    match: /^[0-9]+$/,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

const validateContact = (contact) => {
  const schema = Joi.object({
    firstName: Joi.string().required().trim().min(1).max(50),
    lastName: Joi.string().allow("").trim().max(50),
    number: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(10)
      .pattern(/^[0-9]+$/),
  });

  return schema.validate(contact);
};

exports.Contact = Contact;
exports.validateContact = validateContact;
