const mongoose=require("mongoose");
const branchSchema=new mongoose.Schema({

clinic:{type:String,required:true},
branch:{type:String,required:true},
timings:{type:String,required:true}
});

module.exports=mongoose.model("Branch",branchSchema);