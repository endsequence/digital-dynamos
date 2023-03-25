const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestsSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    reason: { type: String },
    device: { type: Object },
    deviceId: { type: String },
    type: { type: String },
    status: { type: String, default: "PENDING", required: true },
  },
  { autoIndex: false }
);

const Requests = mongoose.model("Requests", requestsSchema);

module.exports = Requests;
