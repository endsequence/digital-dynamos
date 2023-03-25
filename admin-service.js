const Inventory = require("./inventory-model");
const Requests = require("./requests-model");

function getAllChangeRequests(req, res) {
  const query = Requests.find({});

  let requests = [];
  query
    .exec()
    .then((data) => {
      requests = data;
    })
    .catch((err) => {
      res.status(500).send(err);
    });

  if (!requests.length) {
    res.status(404).send("No requests found.");
  } else {
    res.json(requests);
  }
}

function getChangeRequestById(req, res) {
  const query = Requests.find({ id });

  let request;
  query
    .exec()
    .then((data) => {
      request = data;
    })
    .catch((err) => {
      res.status(500).send(err);
    });

  if (!request) {
    res.status(404).send("No request found.");
  } else {
    res.json(requests);
  }
}

function processChangeRequest(req, res) {}

async function getInventory(req, res) {
  const query = Inventory.find({ isAllocated: 1 });

  let inventory = [];
  query
    .exec()
    .then((data) => {
      inventory = data;
    })
    .catch((err) => {
      res.status(500).send(err);
    });

  if (!inventory.length) {
    res.status(404).send("No devices found.");
  } else {
    res.json(inventory);
  }
}

module.exports = {
  getAllChangeRequests,
  getChangeRequestById,
  getInventory,
  processChangeRequest,
};
