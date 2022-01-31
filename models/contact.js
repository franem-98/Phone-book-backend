const mongoose = require("mongoose");

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
    trim: true,
    minlength: [3, "Number must be at least 9 characters long."],
    maxlength: [10, "Number can not be longer than 10 characters."],
  },
});

module.exports = mongoose.model("Contact", contactSchema);
