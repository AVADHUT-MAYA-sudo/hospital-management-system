const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone:String,
    role:{
        type:String,required:true,enum:["superadmin","clinicadmin","clinicx","doctor"]
    },
    otp:String,
    otpExpiry:Date
});

module.exports =
    mongoose.model("User", userSchema);