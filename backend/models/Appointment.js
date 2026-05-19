<<<<<<< HEAD
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

=======
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

>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
module.exports = mongoose.model("Appointment", appointmentSchema);