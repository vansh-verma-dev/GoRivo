const express = require("express");
const { createRide, GetRide, SingleRideDetails, CancelRide } = require("../controller/ride.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/ride" , authMiddleware , createRide );

router.get("/ride" , authMiddleware , GetRide );

router.get("/ride/:rideId", authMiddleware, SingleRideDetails);

router.patch("/ride/:rideId/cancel", authMiddleware, CancelRide);

module.exports = router;