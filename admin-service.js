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
  const { score, userId, deviceId, type } = req.body;

  let status;

  if (type === "P") {
    status = "RECYCLE";
  } else if (score >= 8) {
    status = "RETURN";
  } else if (score >= 6 && score < 8) {
    status = "REPAIR";
  } else if (score >= 4 && score < 6) {
    status = "DONATE";
  } else if (score >= 2 && score < 4) {
    status = "SELL";
  } else {
    status = "RECYCLE";
  }

  if (status !== "RETURN") {
    await removeDeviceFromUser(userId, deviceId);
    await updateInventoryForDevice(deviceId, status);
  }

  if (status === "RECYCLE" && type === "P") {
    await updateRewardsForUser(userId);
  }

  res.json({ status });
}

async function updateRewardsForUser(userId) {
  const query = User.find({ id: userId });

  const user = await query.exec();

  user.rewards += 50;
  await user.save();
}

async function updateInventoryForDevice(deviceId, status) {
  const inventoryQuery = Inventory.find({ id: deviceId });

  const device = await inventoryQuery.exec();

  device.status = status;
  device.isAllocated = 0;

  await device.save();
}

async function removeDeviceFromUser(userId, deviceId) {
  const query = User.find({ id: userId });

  const user = await query.exec();

  user.devices = user.devices.filter((elem) => elem.id !== deviceId);

  await user.save();
}

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
      isAllocated,
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
