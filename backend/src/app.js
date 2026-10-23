const express = require("express");

const loggerMiddleware = require("./middleware/loggerMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddlewae");
const authRouter = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(loggerMiddleware);

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome To GoRivo");
});

// Auth Routes
app.use("/api/auth", authRouter);


// Not Found Middleware
app.use(notFoundMiddleware);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
 