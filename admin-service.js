const Inventory = require("./inventory-model");
const Requests = require("./requests-model");
const User = require("./user-model");

async function getAllChangeRequests(req, res) {
  const query = Requests.find({});
  const userQuery = User.find({});
  const devicesQuery = Inventory.find({});

  try {
    let requests = await query.exec();
    const users = await userQuery.exec();
    const devices = await devicesQuery.exec();

    if (!requests.length) {
      res.status(404).send("No requests found.");
    } else {
      requests = requests.map((request) => {
        const userIdx = users.findIndex(
          (user) => `${user["_id"]}` === request["userId"]
        );
        const deviceIdx = devices.findIndex(
          (device) => `${device["_id"]}` === request["deviceId"]
        );

        console.log({ userIdx, deviceIdx });
        return {
          ...request._doc,
          userName: users[userIdx].name,
          deviceName: devices[deviceIdx].name,
        };
      });
      res.json(requests);
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

async function getChangeRequestById(req, res) {
  const { id } = req.params;
  const query = Requests.find({ _id: id });

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
  const { status, userId, deviceId, requestId } = req.body;

  if (status !== "REJECTED") {
    await removeDeviceFromUser(userId, deviceId);
    await updateInventoryForDevice(deviceId, status);
  }

  await updateRequestStatus(status, requestId);

  res.json({ message: "OK" });
}

async function updateRequestStatus(status, requestId) {
  const query = Requests.find({ _id: requestId });

  const request = await query.exec();

  request.status = status;

  await request.save();
}

async function updateInventoryForDevice(deviceId, status) {
  const query = Inventory.find({ _id: deviceId });

  const device = await query.exec();

  device.status = status;

  await device.save();
}

async function removeDeviceFromUser(userId, deviceId) {
  const query = User.find({ _id: userId });

  const user = await query.exec();

  user.devices = user.devices.filter((elem) => elem._id !== deviceId);

  await user.save();
}

async function getInventory(req, res) {
  const { status } = req.body;

  const query = status ? Inventory.find({ status }) : Inventory.find({});

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
