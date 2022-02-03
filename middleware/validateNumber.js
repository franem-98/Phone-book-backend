const { Contact } = require("../models/contact");

const validateNumber = async (req, res, next) => {
  const { number } = req.body;
  const existingContact = await Contact.findOne({ number });

  if (existingContact)
    return res.status(409).send("Contact with this number already exists.");

  next();
};

module.exports = validateNumber;
