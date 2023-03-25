const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestsSchema = new Schema(
  {
    userId: { type: String, required: true },
    reason: { type: String },
    device: { type: Object },
    deviceId: { type: String },
    type: { type: String },
  },
  { autoIndex: true }
);

const Requests = mongoose.model("Requests", requestsSchema);

module.exports = Requests;
