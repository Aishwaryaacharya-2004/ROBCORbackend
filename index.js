const express = require("express");
const connectDB = require("./database/config");
const registerRoutes = require("./routes/Register");
const transactionRoutes = require("./routes/payment");
const certificateRoutes = require("./routes/certificateRoutes");
const feedbackroute=require("./routes/feedback");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware

const allowedOrigins = ['https://www.robocor.corsit.in', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests




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
    app.use("/api/feedback", feedbackroute);

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
  });
