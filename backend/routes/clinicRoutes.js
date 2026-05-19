const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const Branch = require("../models/Branch");

// Add new staff
router.post("/staff", async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.json({ message: "Staff added successfully", staff });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all staff
router.get("/staff", async (req, res) => {
    try {
        const staffs = await Staff.find().sort({ createdAt: -1 });
        res.json(staffs);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add new branch
router.post("/branch", async (req, res) => {
    try {
        const branch = new Branch(req.body);
        await branch.save();
        res.json({ message: "Branch added successfully", branch });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all branches
router.get("/branch", async (req, res) => {
    try {
        const branches = await Branch.find().sort({ createdAt: -1 });
        res.json(branches);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;