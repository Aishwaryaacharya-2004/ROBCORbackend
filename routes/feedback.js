const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Member = require("../models/Member");

router.post("/submit-feedback", async (req, res) => {
  try {
    let { name, email, usn, event, answers } = req.body;

    if (!event || (!email && !usn)) {
      return res.status(400).json({ message: "Event and either Email or USN are required." });
    }

    event = event.trim();
    email = email ? email.trim().toLowerCase() : null;
    usn = usn ? usn.trim() : null;

    // Build regex conditions for email and usn if provided
    const orConditions = [];
    if (email) orConditions.push({ email: { $regex: `^${email}$`, $options: "i" } });
    if (usn) orConditions.push({ usn: { $regex: `^${usn}$`, $options: "i" } });

    if (orConditions.length === 0) {
      return res.status(400).json({ message: "Email or USN must be provided." });
    }

    // Query: event AND (email OR usn)
    const query = {
      event,
      $or: orConditions,
    };

    const existingMember = await Member.findOne(query);

    if (!existingMember) {
      return res.status(400).json({ message: "Member with provided event and Email/USN not found." });
    }

    const newFeedback = new Feedback({ name, email, usn, event, answers });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;
