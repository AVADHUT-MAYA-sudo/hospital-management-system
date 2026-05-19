const express=require("express");
const router=express.Router();
const Branch=require("../models/branch");

router.post("/",async(req,res)=>{
const branch=new Branch(req.body);
await branch.save();
res.json(branch);});
router.get("/",async(req,res)=>{
const branches=await Branch.find();
res.json(branches);});
module.exports=router;