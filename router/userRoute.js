const express =require ("express")
const router = express.Router()
const app = require("../app");
const Bcrypt = require("bcryptjs")

const User = require("../model/userModel");  
const sendToken = require("../util/jwttoken");
const sendEmail = require('../util/sendEmail')

router.post("/register",async (req,res)=>{
    const {name,email,phone,password,cpassword} = req.body
    console.log({name,email,phone,password,cpassword});
    if(!name || !email || !phone || !password || !cpassword){
     return  res.status(500).json({success:"false",message:"please fill all field"})
    }
    
    try {
        const userExist = await User.findOne({email:email});
        if(userExist){
        return res.status(422).json({error:"email already exist"});
        }
        if(password === cpassword){
        const user = await User.create({name,email,phone ,password});
        const token = user.getjwtToken();
       res.status(201).json({message:"user register succesful",token});
        }
    
    } catch (error) {
        console.log(error)
    }
    
})

router.post("/login", async(req,res)=>{
     try {
        const{email,password} = req.body
        if(!email || !password){
            res.status(500).json({succes:"false",message:"please fill all Field"});
         }
         const user = await User.findOne({email:email})
         if(!user){
            res.send("email did not  matched")
         }else{
            const isMatch = await Bcrypt.compare(password, user.password);

            if(isMatch){
             sendToken(user,201,res)
           }else{
               res.status(500).json({message:"Invalid login detail"})
            }
         }
         

     } catch (error) {
        res.status(400).json({error})
     }
})

///logout 
router.get("/logout", async(req,res) => {
try {
    res.cookie("token",null,{
    expires: new Date(Date.now()),
    httpOnly:true
    })
    res.send("logout successfull")
    
} catch (error) {
    res.send(error)
}
})

// forget password
router.post("/password/forgot", async(req,res)=>{

    const user = await User.findOne({email:req.body.email})
    if(!user){
        res.status(404).json({message:"user not found",succes:"false"}) 
    }else{
        //get password token
     const resetToken = user.getResetPasswordToken();

     await user.save({validateBeforSave: false });

     const resetPasswordUrl = `http://localhost:4000/api/v2/password/reset/${resetToken}`;

     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested email then , please ignore it `;

     try {
        await sendEmail({
        email:user.email,
        subject:`Ecoomerce Password recovery`,
        message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        });
        
     } catch (error) {
        user.restPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforSave: false });
        res.send(error)
     }
    }
     
})


module.exports = router;