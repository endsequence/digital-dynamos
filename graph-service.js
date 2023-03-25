const IdleDevices = require("./idle-devices-model");
const Inventory = require("./inventory-model");

async function getIdleTime(req, res) {
  const { id } = req.params;

  const query = IdleDevices.find({ userId: id });

  try {
    let deviceList = await query.exec();

    deviceList = deviceList.reduce((r, a) => {
      r[a.date] = r[a.date] || [];
      r[a.date].push(a.idleHours);
      return r;
    }, Object.create(null));

    for (key in deviceList) {
      deviceList[key] = deviceList[key].reduce(
        (partialSum, a) => partialSum + a,
        0
      );
    }

    const idleHours = [];
    let totalIdleHours = 0;
    for (key in deviceList) {
      const temp = [];
      const date = key.split("/");
      const dateTimestamp = new Date(date[2], date[1] - 1, date[0]).getTime();
      totalIdleHours += deviceList[key];
      temp.push(dateTimestamp, deviceList[key]);
      idleHours.push(temp);
    }

    res.json({ idleHours, totalIdleHours });
  } catch (err) {
    res.status(500).send(err);
  }
}

async function addIdleTime(req, res) {
  const { deviceId, userId, date, idleHours } = req.body;

  const idleTime = new IdleDevices({ deviceId, userId, date, idleHours });

  const resp = await idleTime.save();
  res.json(resp);
}

async function getInventoryPieChartData(req, res) {
  const query = Inventory.find({});

  try {
    const devices = await query.exec();

    const totalDevices = devices.length;
    let response = [];
    const statusArray = [];

    if (!devices.length) {
      res.send(404).send("No devices found");
    }

    devices.forEach((device) => {
      if (!statusArray.includes(device["status"])) {
        statusArray.push(device["status"]);
        response.push({ name: device["status"], y: 1 });
      } else {
        const idx = response.findIndex(
          (elem) => elem.name === device["status"]
        );
        response[idx]["y"] += 1;
      }
    });

    response = response.map((el) => {
      return { name: el.name, y: (el.y / totalDevices) * 100 };
    });

    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = { addIdleTime, getIdleTime, getInventoryPieChartData };
