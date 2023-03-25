const Inventory=require("./inventory-model.js");
const User=require("./user-model.js");
const Requests=require("./requests-model.js");
const ReadPreference=require('mongodb').ReadPreference;

async function login(req, res) {
  const { password, username }=req.body;
  const docquery=User.find({}).read(ReadPreference.NEAREST);
  let users=await docquery.exec();
  users=JSON.parse(JSON.stringify(users));
  users=users.filter((user) => user.email===username&&user.pass===password);
  if (!users.length) { res.status(500).send("Invalid credentials"); }
  else
    res.json({ message: 'success' });
}

function getUsers(req, res) {
  const docquery=User.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}


function getUserDetails(req, res) {
  const { id }=req.params;
  const docquery=User.find({ _id: id }).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });

}

function getDevicesByUserId(req, res) {
  const { id }=req.params;
  User.findOne({ _id: id })
    .then(user => {
      const devices=user._doc.devices.toObject();
      var value=[];
      var i=0;
      var keys=Object.keys(devices);
      for (i=0; i<keys.length; i++) {
        //value[i] = new mongo.ObjectID(devices[i]._id);
        value[i]=devices[i].id.toString();
      }
      Inventory.find({ id: { $in: value } })
        .then(userDevices => {
          res.json(userDevices);
        })
        .catch(err => {
          res.status(500).send(err);
        });
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

async function getInsights(req, res) {
  const docquery=User.find({}).read(ReadPreference.NEAREST);
  let cfByUserMetrics={};
  let cfByUserAndDevice=[];
  let cfByDeviceArr=[];
  docquery.then(async (users) => {
    for (i=0; i<users.length; i++) {
      const userData=users[i]._doc;
      const userDevices=userData.devices.toObject();
      let cfByDevice;
      var value=[];
      if (userDevices.length) {
        var keys=Object.keys(userDevices);
        for (k=0; k<keys.length; k++) {
          value[k]=userDevices[k].id?.toString();
          const assignedAt=userDevices[k].assignedAt;
          var dateNow=new Date();
          var seconds=Math.floor((dateNow-new Date(assignedAt))/1000);
          var minutes=Math.floor(seconds/60);
          var hours=Math.floor(minutes/60);
          var days=Math.floor(hours/24);
          if (days>30) {
            deviceUsageMonthly=8*30;
          } else {
            deviceUsageMonthly=days*8;
          }
          cfByDevice={
            id: userDevices[k].id,
            deviceUsageMonthly: deviceUsageMonthly
          }
          const cfByDevice1=await Promise.all([
            checkInventoryData(cfByDevice)
          ]);
          cfByDeviceArr[k]=cfByDevice1[0];
        }
      }
      let sum=0;
      for (m=0; m<cfByDeviceArr.length; m++) {
        const temp = [];
        sum+=cfByDeviceArr[m].deviceUsageMonthly;
        temp.push(userData.name,sum);
        cfByUserAndDevice[i]= temp;
      }
    }
    let values  = cfByUserAndDevice.map(function(v) {
      return v[1];
    });

    let max = Math.max.apply( null, values );
    let min = Math.min.apply( null, values );
    var sum = values.reduce(function(a, b) { return a + b; }, 0);

    cfByUserMetrics = {
      avg : sum/values.length,
      min :min,
      max :max,
      cfData : cfByUserAndDevice
    }
    res.json(cfByUserMetrics);
  })
    .catch(err => {
      res.status(500).send(err);
    });
}

async function checkInventoryData(cfByDevice) {
  await Inventory.find({ id: cfByDevice.id }).then(userDevices2 => {
    let keys=Object.keys(userDevices2);
    for (n=0; n<keys.length; n++) {
      const devicesCF=userDevices2[n]._doc.carbonFootprint;
      cfByDevice.deviceUsageMonthly=cfByDevice.deviceUsageMonthly*devicesCF;
    }
  }).catch(err => {
    res.status(500).send(err);
  });
  return cfByDevice;
}

function destroy(req, res) {
  const { id }=req.params;

  User.findOneAndRemove({ _id: id })
    .then(hero => {
      res.json(hero);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function getDeviceDetails(req, res) {
  const { id }=req.params;
  const query=Inventory.find({ _id: id });
  query
    .exec()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function addUsers(req, res) {
  const { id, name, rewards, email, pass, isAdmin, devices }=req.body;

  const user=new User({ id, name, rewards, email, pass, isAdmin, devices });
  user
    .save()
    .then(() => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function createChangeRequest(req, res) {
  const {userId, reason, device, deviceId, type, status }=req.body;
  const id = userId +  deviceId + Date.now();
  const request=new Requests({ id, userId, reason, device, deviceId, type, status });
  request
    .save()
    .then(() => {
      res.json(request);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}


async function submitToolRequest(req, res) {
  // const { id }=req.params;
  // //const query=User.find({ _id: id });
  //  const docquery= User.find({ _id: id }).read(ReadPreference.NEAREST);
  //  const reqq= await docquery.exec();
  //  reqq['rewards'] += 100;
  // await user.save();
}

module.exports={
  login,
  getUserDetails,
  getDeviceDetails,
  submitToolRequest,
  getUsers,
  addUsers,
  getDevicesByUserId,
  getInsights,
  destroy,
  createChangeRequest
};
