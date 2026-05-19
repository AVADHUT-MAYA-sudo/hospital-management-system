const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Add new appointment and auto-generate Token ID
router.post("/", async (req, res) => {
    try {
        const count = await Appointment.countDocuments();
        const newAppointment = new Appointment({
            ...req.body,
            tokenId: count + 1 // Simple token generator
        });
        await newAppointment.save();
        res.json({ message: "Appointment added", appointment: newAppointment });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all appointments (Filterable by doctor)
router.get("/", async (req, res) => {
    try {
        const filter = {};
        if (req.query.doctorName) {
            filter.doctorName = req.query.doctorName;
        }
        const appointments = await Appointment.find(filter).sort({ tokenId: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update appointment status or prescription
router.put("/:id", async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Appointment updated successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;