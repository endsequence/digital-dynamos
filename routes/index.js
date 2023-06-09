const express = require("express");
const router = express.Router();

const heroesService = require("../hero-service");
const adminService = require("../admin-service");
const userService = require("../user-service");
const graphService = require("../graph-service");
const gptService = require("../gpt-service");

router.get("/heroes", (req, res) => {
  heroesService.get(req, res);
});

router.get("/hero/:id", (req, res) => {
  heroesService.getHero(req, res);
});

router.put("/hero", (req, res) => {
  heroesService.create(req, res);
});

router.post("/hero", (req, res) => {
  heroesService.update(req, res);
});

router.delete("/hero/:id", (req, res) => {
  heroesService.destroy(req, res);
});

router.post("/inventory", (req, res) => {
  adminService.getInventory(req, res);
});

router.post("/device", (req, res) => {
  adminService.addDevice(req, res);
});

router.get("/requests", (req, res) => {
  adminService.getAllChangeRequests(req, res);
});

router.get("/requests/:id", (req, res) => {
  adminService.getChangeRequestById(req, res);
});

router.post("/login", (req, res) => {
  userService.login(req, res);
});

router.get("/user", (req, res) => {
  userService.getUsers(req, res);
});

router.put("/user", (req, res) => {
  userService.addUsers(req, res);
});

router.get("/user/:id", (req, res) => {
  userService.getUserDetails(req, res);
});

router.get("/user/device/:id", (req, res) => {
  userService.getDevicesByUserId(req, res);
});

router.get("/device/:id", (req, res) => {
  userService.getDeviceDetails(req, res);
});

router.get("/insights", (req, res) => {
  userService.getInsights(req, res);
});

router.delete("/user/:id", (req, res) => {
  userService.destroy(req, res);
});

router.get("/user/request/:id", (req, res) => {
  userService.submitToolRequest(req, res);
});

router.post("/requests", (req, res) => {
  userService.createChangeRequest(req, res);
});

router.get("/idleTime/:id", (req, res) => {
  graphService.getIdleTime(req, res);
});

router.post("/addIdleTime", (req, res) => {
  graphService.addIdleTime(req, res);
});

router.post("/askGpt", (req, res) => {
  gptService.askGpt(req, res);
});

router.post("/getGptResponse", (req, res) => {
  gptService.getGptResponse(req, res);
});

router.post("/gptQuiz", (req, res) => {
  gptService.getQuiz(req, res);
});

router.post("/verifyAnswer", (req, res) => {
  gptService.verifyAnswer(req, res);
});

router.get("/getPieChartData", (req, res) => {
  graphService.getInventoryPieChartData(req, res);
});

router.post("/processRequest", (req, res) => {
  adminService.processChangeRequest(req, res);
});

module.exports = router;
