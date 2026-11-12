const express = require("express");
const cors = require("cors");

const loggerMiddleware = require("./middleware/loggerMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddlewae");
const authRouter = require("./routes/auth.routes");
const RideRouter = require("./routes/ride.routes");
const DriverRoutes = require("./routes/driver.routes")

const app = express();

// Middleware
app.use(express.json());
app.use(loggerMiddleware);


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://gorivoapp.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Home Route
app.get("/", (req, res) => {
    res.send("Welcome To GoRivo");
});

// Auth Routes
app.use("/api/auth", authRouter);

//passinger Routes
app.use("/api", RideRouter);

//Driver Routes
app.use("/api" , DriverRoutes );

// Not Found Middleware
app.use(notFoundMiddleware);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
