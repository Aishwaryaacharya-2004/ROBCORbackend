// models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email: { type: String, required: true },
    event: { type: String, required: true },
    answers: {
        q1: String,
        q2: String,
        q3: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
