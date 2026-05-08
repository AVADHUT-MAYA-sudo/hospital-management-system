const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: String,
    phone: String,
    clinic: String,
    city: String,
    area: String,
    subscriptionStatus: {
        type: String,
        default: "Inactive"
    },
    subscriptions:{
        type:[
        {
            plan:String,
            doctors:Number,
            amount:Number,
            date:String,
            status:String
        }
        ],
        default: [
            {
                plan: "6 Months",
                doctors: 2,
                amount: 5000,
                date: "21/09/2023",
                status: "Inactive"
            },
            {
                plan: "1 Year",
                doctors: 4,
                amount: 10000,
                date: "21/03/2024",
                status: "Inactive"
            }
        ]
    },
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Patient", patientSchema);