const Inventory = require("./inventory-model.js");
const Requests = require("./requests-model");
const User = require("./user-model.js");
const ReadPreference = require("mongodb").ReadPreference;
const mongo = require("mongodb");

async function login(req, res) {
  const { password, username } = req.body;
  const docquery = User.find({}).read(ReadPreference.NEAREST);
  let users = await docquery.exec();
  users = JSON.parse(JSON.stringify(users));
  users = users.filter(
    (user) => user.email === username && user.pass === password
  );
  if (!users.length) {
    res.status(500).send("Invalid credentials");
  } else {
    const user = users[0];
    res.json({
      message: "success", user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        id: user._id
      }
    });
  }
}

function getUsers(req, res) {
  const docquery = User.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function getUserDetails(req, res) {
  const { id } = req.params;
  const docquery = User.find({ _id: id }).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function getDevicesByUserId(req, res) {
  const { id } = req.params;
  User.findOne({ _id: id })
    .then((user) => {
      const devices = user._doc.devices.toObject();
      var value = [];
      var i = 0;
      var keys = Object.keys(devices);
      for (i = 0; i < keys.length; i++) {
        //value[i] = new mongo.ObjectID(devices[i]._id);
        value[i] = devices[i].id.toString();
      }
      Inventory.find({ id: { $in: value } })
        .then((userDevices) => {
          res.json(userDevices);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function getDeviceDetails(req, res) {
  const { id } = req.params;
  const query = Inventory.find({ _id: id });
  query
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function addUsers(req, res) {
  const { id, name, rewards, email, pass, isAdmin, devices } = req.body;

  const user = new User({ id, name, rewards, email, pass, isAdmin, devices });
  user
    .save()
    .then(() => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function submitToolRequest(req, res) {
  const { id } = req.params;
  User.find({ _id: id })
    .then((user) => {
      user[0]._doc.rewards = (Number(user[0]._doc.rewards) + 100).toString();
      any.save().then(res.json(user));
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

module.exports = {
  login,
  getUserDetails,
  getDeviceDetails,
  submitToolRequest,
  getUsers,
  addUsers,
  getDevicesByUserId,
};
