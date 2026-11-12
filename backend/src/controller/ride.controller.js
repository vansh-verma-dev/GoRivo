
const Ride = require("../module/ride.module");
const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);

const hashOTP = async (otp) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = await scrypt(otp, salt, 64);

    return `${salt}:${hash.toString("hex")}`;
};

const createRide = async (req, res) => {
    try {
        const {
            pickup,
            destination,
            rideType,
            payment,
            distanceKm,
            durationMin,
            fare,
        } = req.body;

        if (
            !pickup?.name ||
            pickup.lat == null ||
            pickup.lng == null ||
            !destination?.name ||
            destination.lat == null ||
            destination.lng == null ||
            !rideType ||
            !payment ||
            !distanceKm ||
            !durationMin ||
            fare == null
        ) {
            return res.status(400).json({
                success: false,
                message: "All booking details are required",
            });
        }

        const passengerId = req.user?.id || req.user?._id;

        if (!passengerId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (
            !Number.isFinite(distanceKm) ||
            !Number.isFinite(durationMin) ||
            !Number.isFinite(fare) ||
            distanceKm <= 0 ||
            durationMin <= 0 ||
            fare < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid ride details",
            });
        }

        const otp = String(crypto.randomInt(1000, 10000));
        const otpHash = await hashOTP(otp);

        const ride = await Ride.create({
            passenger: passengerId,
            pickup,
            destination,
            rideType,
            payment: {
                method: payment,
            },
            distanceKm,
            durationMin,
            fare,
            otpHash,
            status: "searching",
            matching: {
                status: "pending",
            },
        });

        const rideData = ride.toObject();
        delete rideData.otpHash;

        return res.status(201).json({
            success: true,
            message: "Ride booking created successfully",
            data: {
                ...rideData,
                otp,
            },
        });

    } catch (error) {
        console.error("Create Ride Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create ride booking",
            error: error.message,
        });
    }
};


const GetRide = async (req, res) => {
    try {
        const passingerId = req.user.id;

        const rides = await Ride.find({
            passenger: passingerId
        }).sort({ createAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Rides fetched succcesfully",
            totalRides: rides.length,
            data: rides
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch rides",
            error: error.message
        });
    }
}

const SingleRideDetails = async (req, res) => {
    try {
        const { rideId } = req.params;
        const passengerId = req.user.id;

        const ride = await Ride.findOne({
            _id: rideId,
            passenger: passengerId
        });
       

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ride fetched successfully",
            data: ride
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch ride",
            error: error.message
        });
    }
};


const CancelRide = async (req, res) => {
    try {
        const { rideId } = req.params;
        const passengerId = req.user.id;
        const { cancellationReason } = req.body;

        const ride = await Ride.findOne({
            _id: rideId,
            passenger: passengerId
        });

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        if (["completed", "cancelled"].includes(ride.status)) {
            return res.status(400).json({
                success: false,
                message: "Ride cannot be cancelled"
            });
        }

        ride.status = "cancelled";
        ride.cancellationReason = cancellationReason || "Cancelled by passenger";

        await ride.save();

        return res.status(200).json({
            success: true,
            message: "Ride cancelled successfully",
            data: ride
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to cancel ride",
            error: error.message
        });
    }
};
module.exports = {
    createRide,
    GetRide,
    SingleRideDetails,
    CancelRide,
}
