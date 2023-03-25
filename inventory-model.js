const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ownerType: { type: String, required: true },
    carbonFootprint: { type: Number, required: true },
    useByDate: { type: Date, required: true },
    acquiredDate: { type: Date, required: true },
    status: { type: String, required: true },
    isAllocated: { type: String, required: true },
  },
  { autoIndex: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
