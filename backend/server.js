// ADD THIS LINE AT THE VERY TOP to read the .env file
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
const authRoutes = require("./routes/authRoutes");

app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection (UPDATED TO USE .ENV)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected to Cloud"))
    .catch(err => console.log(err));

// Server (UPDATED TO USE .ENV PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});