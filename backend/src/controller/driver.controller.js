const Ride = require("../module/ride.module")

const GetAvailableRides = async (req, res) => {
    try {
        const ride = await Ride.find({
            status: "searching",
            driver: null
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "ride fetched successfully",
            totalRides: ride.length,
            data: ride
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch available rides",
            error: error.message
        });
    }
}

// AcceptRide ride 
const AcceptRide = async (req, res) => {
    try {
        const { rideId } = req.params
        const driverId = req.user.id;

        const ride = await Ride.findOneAndUpdate(
            {
                _id: rideId,
                status: "searching",
                driver: null
            },
            {
                $set: {
                    driver: driverId,
                    status: "accepted"
                }
            },
            {
                new: true
            },
        )

        if (!ride) {
            return res.status(400).json({
                success: false,
                message: "Ride is not available"

            })
        }

        res.status(200).json({
            success: true,
            message: "Ride accepted successfully",
            data: ride
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch available rides",
            error: error.message
        });
    }
}


// update status 
const UpdateStatus = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { status } = req.body;

        // 1. Validation for status
        const allowStatus = ["arrived", "started", "completed"];

        if (!allowStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ride status"
            });
        }



        // 2. Find ride
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }


        console.log("Ride Driver ID:", ride.driver);
        console.log("Logged In User:", req.user);
        console.log("User ID:", req.user.id);
        // 3. Check assigned driver
        if (ride.driver?.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this ride"
            });
        }

        // 4. Validate status transition
        const validTransitions = {
            accepted: "arrived",
            arrived: "started",
            started: "completed"
        };

        if (validTransitions[ride.status] !== status) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${ride.status} to ${status}`
            });
        }

        // 5. Update status
        ride.status = status;
        await ride.save();

        // 6. Response
        return res.status(200).json({
            success: true,
            message: `Ride status updated successfully: ${status}`,
            data: ride
        });

    } catch (error) {
        console.error("Update Ride Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update ride status",
            error: error.message
        });
    }
};

module.exports = {
    GetAvailableRides,
    AcceptRide,
    UpdateStatus
}