const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone:String,
    role:String,
    otp:String,
    otpExpiry:Date
});

module.exports =
    mongoose.model("User", userSchema);