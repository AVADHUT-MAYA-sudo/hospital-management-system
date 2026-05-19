const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const Patient = require("../models/patient");
=======
const Patient = require("../models/Patient");
>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
// conforming paymentgateway
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// add
router.post("/", async (req,res)=>{
    try{
        const patient = new Patient(req.body);
        await patient.save();
        res.json({message:"Registration Successful",patient: patient});
    }catch(err){
        res.status(500).json(err);
    }
});

// list
router.get("/", async (req,res)=>{
    try{
        const status = req.query.status;
        const search = req.query.search;

        let filter = {};

        if(status) filter.status = status;

        if(search){
            filter.$or = [
                {name:{$regex:search,$options:"i"}},
                {city:{$regex:search,$options:"i"}},
                {clinic:{$regex:search,$options:"i"}},
                {area:{$regex:search,$options:"i"}}
            ];
        }

        const patients = await Patient.find(filter).sort({
            createdAt:-1
        });

        res.json(patients);

    }catch(err){
        res.status(500).json(err);
    }
});

// single patient
router.get("/:id", async (req,res)=>{
    try{
        const patient = await Patient.findById(req.params.id);
        res.json(patient);
    }catch(err){
        res.status(500).json(err);
    }
});

// update status
router.put("/:id", async (req,res)=>{
    try{
        await Patient.findByIdAndUpdate(req.params.id,{
            status:req.body.status
        });

        res.json({message:"Updated"});
    }catch(err){
        res.status(500).json(err);
    }
});

// subscription
router.put("/:id/subscription", async(req,res)=>{
    try{
        const { plan, doctors, total } = req.body;

        const patient =
            await Patient.findById(req.params.id);

        if(!patient){
            return res.status(404).json({
                message:"Patient not found"
            });
        }

        patient.subscriptionStatus = "Active";

        patient.subscriptions =
            patient.subscriptions.map(sub=>{
                if(sub.plan === plan){
                    sub.doctors = doctors;
                    sub.amount = total;
                    sub.status = "Active";
                    sub.date = new Date().toLocaleDateString();
                }
                return sub;
            });

        await patient.save();

        res.json({
            message:"Subscription updated"
        });

    }catch(err){
        res.status(500).json(err);
    }
});
// payments

router.put("/:id/payment", async (req,res)=>{
    try{
        const patient =
            await Patient.findById(req.params.id);

        if(!patient){
            return res.status(404).json({
                message:"Patient not found"
            });
        }

        patient.paymentStatus = "Paid";

        await patient.save();

        res.json({
            message:"Payment Successful"
        });

    }catch(err){
        res.status(500).json(err);
    }
});
// payment gateway order creation
router.post("/create-order", async (req,res)=>{
    try{
        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        });

        res.json(order);

    }catch(err){
        res.status(500).json(err);
    }
});
router.post("/verify-payment", async(req,res)=>{
    try{
        const patientId = req.body.patientId;

        await Patient.findByIdAndUpdate(
            patientId,
            {
                paymentStatus:"Paid",
                subscriptionStatus:"Active"
            }
        );

        res.json({
            success:true
        });

    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;