const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/.+@.+\..+/, "Invalid email format"]
  },
  usn: { type: String, required: true, trim: true },
  phone: { 
    type: String, 
    required: true, 
    trim: true, 
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
  },
  bgmiid:{type:String},
  event: { type: String, required: true, trim: true },
  transactionId: String,
});

// Removed the unique index to allow multiple registrations for the same email with different events.

module.exports = mongoose.model("Member", MemberSchema);
