const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const idleDevicesSchema = new Schema(
  {
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    date: { type: String, required: true },
    idleHours: { type: Number, required: true },
  },
  { autoIndex: true }
);

const IdleDevices = mongoose.model("IdleDevices", idleDevicesSchema);

module.exports = IdleDevices;
