const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const MONGO_URI = process.env.MONGO_URI; // Fetch the URI from the .env file

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
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
