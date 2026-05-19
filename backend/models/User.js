const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone:String,
<<<<<<< HEAD
    role:{
        type:String,required:true,enum:["superadmin","clinicadmin","clinicx","doctor"]
    },
=======
    role:String,
>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
    otp:String,
    otpExpiry:Date
});

module.exports =
    mongoose.model("User", userSchema);