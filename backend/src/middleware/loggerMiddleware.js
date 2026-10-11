const loggerMiddleware = (req , res, next)=>{
    console.log(`Method:${req.method} URL:${req.originalUrl} Date:${new Date().toISOString()}`);

    next();
}

module.exports = loggerMiddleware;