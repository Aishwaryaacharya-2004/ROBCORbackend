const express = require("express");
const connectDB = require("./database/config");
const registerRoutes = require("./routes/Register");
const transactionRoutes = require("./routes/payment");
const certificateRoutes = require("./routes/certificateRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
const corsOptions = {
  origin: 'https://www.robocor.corsit.in', // Allow only this domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // Test Route
    app.get("/", (req, res) => {
      res.json("Hello!!!");
    });

    // API Routes
    app.use("/api", registerRoutes);
    app.use("/api", transactionRoutes);
    app.use("/api/certificate", certificateRoutes);

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
  });
