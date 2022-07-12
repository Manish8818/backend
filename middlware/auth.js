const jwt = require("jsonwebtoken")
const User = require("../model/userModel")

exports.isAuthenticatedUser = async(req,res,next) =>{
  
  
    const {token} = req.cookies;
    if(!token){
        res.status(401).send("please login")
            }else{
                    try {
                         const decoded = jwt.verify(token, process.env.JWT_SECRET);

                         req.user = await User.findById(decoded._id);

                         next()
                        } catch (err) {
                            return res.status(401).send("Invalid Token");
                        }
        }
    
    
}

/// for admin role

exports.authorizeRoles = (...roles) =>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        res.status(401).send(`Role ${req.user.role} is note allowed to access this resource`)
    }else{
        next();
    }
    
    };
};