const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  GetAvailableRides,
  AcceptRide,
  UpdateStatus,
  GetDriverRides,
} = require("../controller/driver.controller");

const routes = express.Router();

routes.get("/drive/ride", authMiddleware, GetAvailableRides);
routes.get("/drive/my-rides", authMiddleware, GetDriverRides);

routes.patch("/drive/:rideId/accept", authMiddleware, AcceptRide);
routes.patch("/drive/:rideId/status", authMiddleware, UpdateStatus);

module.exports = routes;