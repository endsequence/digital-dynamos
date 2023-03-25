const IdleDevices = require("./idle-devices-model");

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
    for (key in deviceList) {
      const temp = [];
      const date = key.split("/");
      const dateTimestamp = new Date(date[2], date[1] - 1, date[0]).getTime();
      temp.push(dateTimestamp, deviceList[key]);
      idleHours.push(temp);
    }

    res.json({ idleHours });
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

module.exports = { addIdleTime, getIdleTime };
