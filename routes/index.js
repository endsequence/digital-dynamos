const express = require('express');
const router = express.Router();

const heroesService = require('../hero-service');
const adminService = require('../admin-service')

router.get('/heroes', (req, res) => {
  heroesService.get(req, res);
});

router.get('/hero/:id', (req, res) => {
  heroesService.getHero(req, res);
});

router.put('/hero', (req, res) => {
  heroesService.create(req, res);
});

router.post('/hero', (req, res) => {
  heroesService.update(req, res);
});

router.delete('/hero/:id', (req, res) => {
  heroesService.destroy(req, res);
});

router.get('/inventory', (req, res) => {
  adminService.getInventory(req, res);
})

router.post('/device', (req,res) => {
  adminService.addDevice(req, res)
})

router.get('/requests', (req, res) => {
  adminService.getAllChangeRequests(req, res);
})

router.get('/requests/:id', (req, res) => {
  adminService.getChangeRequestById(req, res);
})

module.exports = router;
