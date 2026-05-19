const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    tokenId: Number,
    patientName: String,
    phone: String,
    age: Number,
    gender: String,
    doctorName: String,
    status: {
        type: String,
        default: "In Queue" // "In Queue", "In Progress", "Completed", "Cancelled"
    },
    prescription: String,
    nextVisit: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);