const Inventory = require("./inventory-model");
const Requests = require("./requests-model");

async function getAllChangeRequests(req, res) {
  const query = Requests.find({});

  try {
    const requests = await query.exec();

    if (!requests.length) {
      res.status(404).send("No requests found.");
    } else {
      res.json(requests);
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

async function getChangeRequestById(req, res) {
  const { id } = req.params;
  const query = Requests.find({ id });

  try {
    const requests = await query.exec();

    if (!requests.length) {
      res.status(404).send("No requests found.");
    } else {
      res.json(requests);
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

function processChangeRequest(req, res) {}

async function getInventory(req, res) {
  const query = Inventory.find({ isAllocated: 1 });

  try {
    let inventory = await query.exec();

    if (!inventory.length) {
      res.status(404).send("No devices found.");
    } else {
      res.json(inventory);
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

async function addDevice(req, res) {
  const {
    name,
    ownerType,
    carbonFootprint,
    useByDate,
    acquiredDate,
    status,
    isAllocated,
  } = req.body;

  try {
    const device = new Inventory({
      name,
      ownerType,
      carbonFootprint,
      useByDate,
      acquiredDate,
      status,
      isAllocated,
    });

    const response = await device.save();

    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  getAllChangeRequests,
  getChangeRequestById,
  getInventory,
  processChangeRequest,
  addDevice,
};
