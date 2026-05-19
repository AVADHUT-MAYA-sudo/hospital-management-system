const express=require("express");
const router=express.Router();
const User=require("../models/user");

/* SEND OTP */
router.post("/send-otp",async(req,res)=>{
try{
const{phone,role}=req.body;if(!phone||!role){
return res.status(400).json({
    message:"Missing fields"});
}
const otp=Math.floor(1000+Math.random()*9000).toString();
let user=await User.findOne({phone});
if(!user){
user=new User({phone,role
});
}
user.otp=otp;
user.otpExpiry=Date.now()+300000;
await user.save();
console.log("OTP:",otp);
res.json({success:true,message:"OTP sent successfully"});
}
catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
});
/* VERIFY OTP */
router.post("/verify-otp",async(req,res)=>{
try{
const{phone,otp}=req.body;
const user=await User.findOne({phone});

if(!user){
    return res.status(404).json({success:false,message:"User not found"}
);
}
if(user.otp!==otp){
    return res.status(400).json({success:false,message:"Invalid OTP"
});
}
if(Date.now()>user.otpExpiry){
    return res.status(400).json({success:false,message:"OTP expired"});
}

user.otp=null;
user.otpExpiry=null;
await user.save();
res.json({success:true,role:user.role});
}
catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}});
module.exports=router;