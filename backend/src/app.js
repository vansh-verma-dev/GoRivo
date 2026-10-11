const express = require("express");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddlewae");
const app = express();
 
//Middleware
app.use(express.json()); 
app.use(loggerMiddleware);


//Routes
app.get("/" ,(req , res)=>{
    res.send("Welcome To GoRivo");
})

//Not Found Middleware
app.use(notFoundMiddleware);

//error middleware
app.use(errorMiddleware);

module.exports = app;