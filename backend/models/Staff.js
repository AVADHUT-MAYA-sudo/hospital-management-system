const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    name: String,
    designation: String,
    specialization: String,
    phone: String,
    qualification: String,
    branch:{
        type:String,
        default:"Not Assigned"
    },
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