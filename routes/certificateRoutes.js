const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Member = require("../models/Member.js");

const router = express.Router();

// 📄 Generate Certificate Route
router.post("/generate-certificate", async (req, res) => {
  const { email, usn, event } = req.body;

  if (!event || (!email && !usn)) {
    return res.status(400).json({ error: "Event and either Email or USN are required." });
  }

  try {
    // Find user by either email or usn for the event
    const query = { event };
    if (email) query.email = email.trim().toLowerCase();
    else if (usn) query.usn = usn.trim(); // Assuming USNs are stored in uppercase

    const user = await Member.findOne(query);

    if (!user) {
      return res.status(404).json({
        error: "No participant found for this event using provided Email or USN",
      });
    }

    const memberName = user.name || "Participant";
    const eventName = user.event || "a sub-event";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${memberName}_certificate.pdf`);

    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    doc.pipe(res);

    const bgPath = path.join(__dirname, "../final.png");
    if (fs.existsSync(bgPath)) {
      doc.image(bgPath, 0, 0, { width: 842, height: 595 });
    }

    // Participant Name
    doc.font("Helvetica-Bold")
      .fontSize(26)
      .fillColor("#800080")
      .text(memberName, 200, 280, { align: "center", width: 442 });

    // Event Name
    doc.font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#800080")
      .text(eventName, 200, 350, { align: "center", width: 442 });

    doc.end();
  } catch (error) {
    console.error("❌ Error generating certificate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
