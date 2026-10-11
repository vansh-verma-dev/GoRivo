const notFoundMiddleware  = (req , res , next)=>{
    res.status(400).json({
        success : false , 
        message : `Not Found ${req.originalUrl}`
    })
}
module.exports = notFoundMiddleware;