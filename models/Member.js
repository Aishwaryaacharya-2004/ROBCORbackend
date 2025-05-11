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
  event: { type: String, required: true, trim: true },
  transactionId: String,
});

// ✅ Correct compound indexes
MemberSchema.index({ email: 1, event: 1 }, { unique: true });
MemberSchema.index({ usn: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Member", MemberSchema);
