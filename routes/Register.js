const express = require("express");
const Member = require("../models/Member");

const router = express.Router();

const eventRules = {
 "Binary Duels": { min: 1, max: 2 },
  "Arduino Forge": { min: 1, max: 3 },
  "Cyber Track": { min: 1, max: 4 },
  "Neon Maze": { min: 1, max: 4 },
  "Project Conclave": { min: 1, max: 4 },
  "Cyber Kick": { min: 1, max: 4 },
  "Nexus Quiz":{min:1,max:1},
  "Neon Run":{min:1,max:4},
  "BGMI Punks":{min:2,max:4},
};

router.post("/register", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { event, members } = req.body;

    // Validate input
    if (!event || !members || !Array.isArray(members)) {
      console.log("❌ Invalid request data:", req.body);
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Check if event is valid
    if (!eventRules[event]) {
      console.log("❌ Invalid event selected:", event);
      return res.status(400).json({ message: "Invalid event selected" });
    }

    // Validate team size
    const { min, max } = eventRules[event];
    if (members.length < min || members.length > max) {
      console.log(`❌ Participants count issue: ${members.length}, Allowed: ${min} - ${max}`);
      return res.status(400).json({ message: `Participants should be between ${min} and ${max}` });
    }

    // Assign event to each member
    const membersWithEvent = members.map((member) => ({
      ...member,
      event,
    }));

    console.log("✅ Inserting into DB:", membersWithEvent);
    for (const member of membersWithEvent) {
  const existing = await Member.findOne({ email: member.email, event });
  if (existing) {
    return res.status(400).json({ 
      message: `Member with email ${member.email} is already registered for ${event}` 
    });
  }
}
await Member.insertMany(membersWithEvent);


    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
