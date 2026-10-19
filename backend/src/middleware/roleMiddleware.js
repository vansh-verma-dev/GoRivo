const roleMiddleware = (...allowedRoles)=>{
     return (req , res ,next)=>{
        if(!req.User || !allowedRoles.includes(req.User.role)){
            return res.status(400).json({
                success : false ,
                message : "Access forbidden: insufficient permissions"
            })
        };
        next()
     };
}

module.exports = roleMiddleware;