<<<<<<< HEAD
const mongoose=require("mongoose");
const branchSchema=new mongoose.Schema({

clinic:{type:String,required:true},
branch:{type:String,required:true},
timings:{type:String,required:true}
});

module.exports=mongoose.model("Branch",branchSchema);
=======
const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    clinicName: String,
    branchName: String,
    timings: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Branch", branchSchema);
>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
