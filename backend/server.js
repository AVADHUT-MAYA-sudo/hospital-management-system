<<<<<<< HEAD
require("dotenv").config();
=======
// ADD THIS LINE AT THE VERY TOP to read the .env file
require("dotenv").config();

>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

<<<<<<< HEAD

=======
>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
// Middleware
app.use(cors());
app.use(express.json());

// Routes
const patientRoutes = require("./routes/patientRoutes");
<<<<<<< HEAD
app.use("/api/patients", patientRoutes);
=======
const authRoutes = require("./routes/authRoutes");

app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);
>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

<<<<<<< HEAD
// Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

// Auth Routes
const authRoutes =require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const staffRoutes=require("./routes/staffRoutes");
const branchRoutes=require("./routes/branchRoutes");
app.use("/api/staff",staffRoutes);
app.use("/api/branch",branchRoutes);
=======
// Server (UPDATED TO USE .ENV PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
>>>>>>> b5b309a4f744f8f2d3d6f6ea48338d714621a05a
