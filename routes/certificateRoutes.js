const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Member = require("../models/Member.js");

const router = express.Router();

// 📄 Generate Certificate Route
router.post("/generate-certificate", async (req, res) => {
    const { Name, email, eventName } = req.body;

    if (!Name || !email || !eventName) {
        return res.status(400).json({ error: "Name, Email, and Event Name are required." });
    }

    try {
        // 🔎 Check if email exists in the database
        const user = await Member.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: "Email not found in the database" });
        }

        const memberName = user.name;

        // Set response headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${memberName}_${eventName}_certificate.pdf`);

        const doc = new PDFDocument({ size: "A4", layout: "landscape" });
        doc.pipe(res);

        // 🖼️ Add background image
        const bgPath = path.join(__dirname, "../certificate.png");
        if (fs.existsSync(bgPath)) {
            doc.image(bgPath, 0, 0, { width: 842, height: 595 });
        }

        // 🏆 Certificate Title
        doc.font("Helvetica-Bold").fontSize(36).fillColor("#2B2B52").text("Certificate of Participation", { align: "center", underline: true });

        // 📌 Certification Text
        doc.moveDown();
        doc.fontSize(20).fillColor("black").text(`This is to certify that`, { align: "center" });

        // ✍️ Participant Name
        doc.moveDown();
        doc.font("Helvetica-Bold").fontSize(30).fillColor("#D32F2F").text(memberName, { align: "center" });

        // 📄 Event Details
        doc.moveDown();
        doc.font("Helvetica").fontSize(20).fillColor("black").text(`has successfully participated in`, { align: "center" });

        doc.font("Helvetica-Bold").fontSize(24).fillColor("#00796B").text(eventName, { align: "center" });

        // ✏️ Signatures & Date
        doc.moveDown(3);
        doc.fontSize(15).fillColor("black").text("_________________", 150, 450);
        doc.text("Organizer", 180, 470);
        doc.fontSize(15).text("_________________", 550, 450);
        doc.text("Date", 600, 470);

        doc.end();
    } catch (error) {
        console.error("❌ Error generating certificate:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
