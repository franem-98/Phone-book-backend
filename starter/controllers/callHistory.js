const moment = require("moment");
const { Call } = require("../models/call");
const asyncWrapper = require("../middleware/async");

const callNotFoundMessage = (id) => {
  return `Call with id: ${id} not found.`;
};

const getCallHistory = asyncWrapper(async (req, res, next) => {
  const callHistory = await Call.find({});
  res.status(200).send(callHistory);
});

const getCall = asyncWrapper(async (req, res, next) => {
  const { id: callId } = req.params;
  const call = await Call.findOne({ _id: callId });

  if (!call) {
    return res.status(404).send(callNotFoundMessage(callId));
  }

  res.status(200).send(call);
});

const createCall = asyncWrapper(async (req, res, next) => {
  const callBody = { ...req.body };
  const newEndTime = moment(callBody.endTime)
    .format("DD/MM/YYYY HH:mm")
    .toString();
  callBody.endTime = newEndTime;

  const call = await Call.create(callBody);
  res.status(201).send(call);
});

const deleteCall = asyncWrapper(async (req, res, next) => {
  const { id: callId } = req.params;
  const call = await Call.findOneAndDelete({ _id: callId });

  if (!call) {
    return res.status(404).send(callNotFoundMessage(callId));
  }

  res.status(200).send(call);
});

module.exports = {
  getCallHistory,
  getCall,
  createCall,
  deleteCall,
};
