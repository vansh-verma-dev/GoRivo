
const Ride = require("../module/ride.module");

const GetAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "searching",
      driver: null,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Rides fetched successfully",
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

const AcceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user.id;

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
        },
      },
      { new: true }
    );

    if (!ride) {
      return res.status(400).json({
        success: false,
        message: "Ride is not available",
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

const UpdateStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status, otp } = req.body;

    const allowedStatuses = ["arriving", "started", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ride status",
      });
    }

    // +otp zaroori hai, taaki PIN compare ho sake
    const ride = await Ride.findById(rideId).select("+otp");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.driver?.toString() !== req.user.id) {
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

      // 5 galat try ke baad block (4 digit PIN brute-force na ho)
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

    // Driver ko response me OTP mat bhejo
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

module.exports = {
  GetAvailableRides,
  AcceptRide,
  UpdateStatus,
};
