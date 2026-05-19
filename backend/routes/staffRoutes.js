
const express=require("express");
const router=express.Router();
const Staff=require("../models/staff");

router.post("/",async(req,res)=>{
    const staff=new Staff(req.body);
    await staff.save();
    res.json(staff);}
);
router.get("/",async(req,res)=>{
    const staff=await Staff.find();
    res.json(staff);}
);
router.get("/:id",async(req,res)=>{
    const staff=await Staff.findById(
    req.params.id);
    res.json(staff);});

// assign branch to staff
router.put("/assign/:id",
    async(req,res)=>{
try{const {branch}=req.body;
    const staff=await Staff.findByIdAndUpdate(req.params.id,{branch},{new:true});
    res.json(staff);
}
catch(err){
console.log(err);
res.status(500).json({message:"Server Error"});
}}
);
module.exports=router;