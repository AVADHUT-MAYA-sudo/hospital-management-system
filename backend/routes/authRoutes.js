const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* send otp */
router.post("/send-otp", async(req,res)=>{
    try{
        const { phone, role } = req.body;

        const otp =
            Math.floor(
                1000 + Math.random()*9000
            ).toString();

        const expiry =
            new Date(Date.now() + 5*60*1000);

        let user =
            await User.findOne({ phone });

        if(!user){
            user = new User({
                phone,
                role
            });
        }

        user.otp = otp;
        user.otpExpiry = expiry;

        await user.save();

        console.log("OTP:", otp);

        res.json({
            message:"OTP Sent"
        });

    }catch(err){
        res.status(500).json(err);
    }
});

/* verify otp */
router.post("/verify-otp", async(req,res)=>{
    try{
        const { phone, otp } = req.body;

        const user =
            await User.findOne({
                phone,
                otp
            });

        if(
            !user ||
            user.otpExpiry < new Date()
        ){
            return res.status(400).json({
                message:"Invalid OTP"
            });
        }

        res.json({
            success:true,
            role:user.role
        });

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;