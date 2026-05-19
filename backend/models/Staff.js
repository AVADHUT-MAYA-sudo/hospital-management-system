<<<<<<< HEAD
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

=======
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

>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
module.exports = mongoose.model("Staff", staffSchema);