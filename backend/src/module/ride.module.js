
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// Location Schema
const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  { _id: false }
);

// Ride Schema
const rideSchema = new Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      index: true,
    },

    passenger: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    pickup: {
      type: locationSchema,
      required: true,
    },

    destination: {
      type: locationSchema,
      required: true,
    },

    rideType: {
      type: String,
      required: true,
      enum: ["go-mini", "go-comfort", "go-xl"],
    },

    distanceKm: {
      type: Number,
      required: true,
      min: 0.1,
    },

    durationMin: {
      type: Number,
      required: true,
      min: 1,
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    payment: {
      method: {
        type: String,
        enum: ["cash", "online"],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "paid",
          "failed",
          "refunded",
        ],
        default: "pending",
      },

      transactionId: {
        type: String,
        default: null,
      },
    },

    status: {
      type: String,
      enum: [
        "searching",
        "accepted",
        "arriving",
        "started",
        "completed",
        "cancelled",
        "no_driver_found",
      ],
      default: "searching",
      index: true,
    },

    matching: {
      status: {
        type: String,
        enum: [
          "pending",
          "searching",
          "matched",
          "exhausted",
          "stopped",
        ],
        default: "pending",
      },

      attempts: {
        type: Number,
        default: 0,
      },
    },

    otpHash: {
      type: String,
      default: null,
      select: false,
    },

    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,

    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Generate booking ID
rideSchema.pre("validate", function () {
  if (!this.bookingId) {
    this.bookingId =
      "GR-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 7).toUpperCase();
  }

 
});

rideSchema.index({ passenger: 1, createdAt: -1 });
rideSchema.index({ driver: 1, status: 1 });

module.exports = model("Ride", rideSchema);
