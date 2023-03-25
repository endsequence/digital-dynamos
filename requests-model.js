const mongoose = require("mongoose");
const Inventory = require("./inventory-model");
const Scheama = mongoose.Schema;

const requestsSchema = new Scheama(
  {
    userId: { type: String, required: true },
    reason: { type: String },
    device: { type: Inventory },
    deviceId: { type: String },
    type: { type: String },
  },
  { autoIndex: true }
);

const Requests = mongoose.model("Requests", requestsSchema);

module.exports = Requests;
