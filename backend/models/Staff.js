const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    name: String,
    designation: String,
    specialization: String,
    phone: String,
    qualification: String,
    branch: String,
    status: {
        type: String,
        default: "Active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Staff", staffSchema);