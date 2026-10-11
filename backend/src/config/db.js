
const dns = require("node:dns");

// Use public DNS for Node.js DNS lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Atlas connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;
