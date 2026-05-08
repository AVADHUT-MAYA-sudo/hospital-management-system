require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patients", patientRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/hospitalDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

// Auth Routes
const authRoutes =
    require("./routes/authRoutes");

app.use("/api/auth", authRoutes);