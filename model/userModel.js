const mongoose = require ("mongoose")
const Bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require ("crypto")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{        
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    role:{
        type:String,
        default:"user"
    }
})
//hashing password by using Bcrypt
userSchema.pre("save", async function(next){
if(this.isModified('password')){
    this.password = await Bcrypt.hash(this.password, 10)
}
    next();
})
//jwt token 
userSchema.methods.getjwtToken = function  (){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
}
//getting password rest token 
userSchema.methods.getResetPasswordToken = async function () {

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // generate hash token and add to db
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken
    console.log(resetToken)

}

module.exports = mongoose.model("USER",userSchema);