const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    rewards: { type: String, required: true },
    email: { type: String, required: true },
    pass: { type: String, required: true },
    isAdmin: { type: String, required: true },
    devices: [
        new Schema({
            id: { type: String, required: true, unique: true },
            assignedAt: { type: Date, default: Date.now , required: true},
            releasedAt: { type: Date, default: Date.now , required: true},
        })
      ],
  },
  { autoIndex: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;