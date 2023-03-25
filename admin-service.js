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

async function processChangeRequest(req, res) {
  const { status, userId, deviceId } = req.body;

  if (status !== "REJECTED") {
    await removeDeviceFromUser(userId, deviceId);
    await updateInventoryForDevice(deviceId, status);
  }

  res.json({ message: "OK" });
}

async function updateInventoryForDevice(deviceId, status) {
  const query = Inventory.find({ id: deviceId });

  const device = await query.exec();

  device.status = status;

  await device.save();
}

async function removeDeviceFromUser(userId, deviceId) {
  const query = User.find({ id: userId });

  const user = await query.exec();

  user.devices = user.devices.filter((elem) => elem.id !== deviceId);

  await user.save();
}

async function getInventory(req, res) {
  const query = Inventory.find({});

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
    imgUrl,
  } = req.body;

  const id = name + Date.now();
  try {
    const device = new Inventory({
      id,
      name,
      ownerType,
      carbonFootprint,
      useByDate,
      acquiredDate,
      status,
      imgUrl,
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
