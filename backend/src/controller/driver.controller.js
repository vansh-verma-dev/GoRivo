const Ride = require("../module/ride.module");
const mongoose = require("mongoose");


const getDriverId = (req) => req.user?.id || req.user?._id;

// 1. Get all open rides searching for a driver
const GetAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "searching",
      driver: null,
    })
      .populate("passenger", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Available rides fetched successfully",
      totalRides: rides.length,
      data: rides,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch available rides",
      error: error.message,
    });
  }
};

// 2. Accept a ride (blocks accepting if driver already has an active trip)
const AcceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = getDriverId(req);

    // Check if driver already has an ongoing ride
    const existingActiveRide = await Ride.findOne({
      driver: driverId,
      status: { $in: ["accepted", "arriving", "started"] },
    });

    if (existingActiveRide) {
      return res.status(400).json({
        success: false,
        message: "Complete your current active ride before accepting a new one.",
        activeRideId: existingActiveRide._id,
      });
    }

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "searching",
        driver: null,
      },
      {
        $set: {
          driver: driverId,
          status: "accepted",
          acceptedAt: new Date(),
        },
      },
      { new: true }
    ).populate("passenger", "name phone");

    if (!ride) {
      return res.status(400).json({
        success: false,
        message: "Ride is no longer available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride accepted successfully",
      data: ride,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to accept ride",
      error: error.message,
    });
  }
};

// 3. Update active ride status (arriving -> started -> completed)
const UpdateStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status, otp } = req.body;
    const driverId = getDriverId(req);

    const allowedStatuses = ["arriving", "started", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ride status",
      });
    }

    const ride = await Ride.findById(rideId).select("+otp");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.driver?.toString() !== String(driverId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this ride",
      });
    }

    const validTransitions = {
      accepted: "arriving",
      arriving: "started",
      started: "completed",
    };

    if (validTransitions[ride.status] !== status) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${ride.status} to ${status}`,
      });
    }

    if (status === "started") {
      if (!otp || !/^\d{4}$/.test(String(otp))) {
        return res.status(400).json({
          success: false,
          message: "Valid 4-digit ride PIN is required",
        });
      }

      if ((ride.otpAttempts || 0) >= 5) {
        return res.status(429).json({
          success: false,
          message: "Too many wrong attempts. Ask passenger to rebook.",
        });
      }

      if (String(ride.otp) !== String(otp)) {
        ride.otpAttempts = (ride.otpAttempts || 0) + 1;
        await ride.save();

        return res.status(400).json({
          success: false,
          message: "Incorrect PIN",
        });
      }

      ride.startedAt = new Date();
    }

    ride.status = status;

    if (status === "completed") {
      ride.completedAt = new Date();
    }

    await ride.save();
    await ride.populate("passenger", "name phone");

    const rideData = ride.toObject();
    delete rideData.otp;

    return res.status(200).json({
      success: true,
      message: "Ride status updated successfully",
      data: rideData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update ride status",
      error: error.message,
    });
  }
};

// 4. Get Driver's Currently Active Ride (for Driver Dashboard)
const GetDriverActiveRide = async (req, res) => {
  try {
    const driverId = getDriverId(req);

    const activeRide = await Ride.findOne({
      driver: driverId,
      status: { $in: ["accepted", "arriving", "started"] },
    })
      .populate("passenger", "name phone")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: activeRide || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active ride",
      error: error.message,
    });
  }
};

const GetDriverRides = async (req, res, next) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.QUERY:", req.query);

    const rawDriverId =
      req.user?.id || req.user?._id || req.user?.userId || req.user?.driverId;

    const rides = await Ride.find({ driver: rawDriverId }).sort({ createdAt: -1 });
    console.log("FOUND RIDES COUNT:", rides.length);

    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  GetAvailableRides,
  AcceptRide,
  UpdateStatus,
  GetDriverActiveRide,
  GetDriverRides,
};