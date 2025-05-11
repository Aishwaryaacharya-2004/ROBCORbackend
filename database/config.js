const mongoose = require('mongoose');
require('dotenv').config(); // ✅ Loads from .env locally

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MongoDB URI is not defined in the environment variables.");
        }
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('MongoDB Connection Failed!', error);
        process.exit(1);
    }
};

module.exports = connectDB;
