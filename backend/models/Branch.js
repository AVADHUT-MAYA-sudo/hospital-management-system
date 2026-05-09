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