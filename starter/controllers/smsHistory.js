const moment = require("moment");
const { Sms } = require("../models/sms");
const asyncWrapper = require("../middleware/async");

const smsNotFoundMsg = (id) => {
  return `SMS with id: ${id} does not exist.`;
};

const getSmsHistory = asyncWrapper(async (req, res, next) => {
  const smsHistory = await Sms.find({});
  res.status(200).send(smsHistory);
});

const createSms = asyncWrapper(async (req, res, next) => {
  const smsBody = { ...req.body };
  smsBody.timestamp = moment(smsBody.timestamp)
    .format("DD/MM/YYYY HH:mm")
    .toString();

  const sms = await Sms.create(smsBody);
  res.status(201).send(sms);
});

const getSms = asyncWrapper(async (req, res, next) => {
  const { id: smsId } = req.params;
  const sms = await Sms.findOne({ _id: smsId });

  if (!sms) {
    return res.status(404).send(smsNotFoundMsg(smsId));
  }

  res.status(200).send(sms);
});

const deleteSms = asyncWrapper(async (req, res, next) => {
  const { id: smsId } = req.params;
  const sms = await Sms.findOneAndDelete({ _id: smsId });

  if (!sms) {
    return res.status(404).send(smsNotFoundMsg(smsId));
  }

  res.status(200).send(sms);
});

module.exports = { getSmsHistory, createSms, getSms, deleteSms };
