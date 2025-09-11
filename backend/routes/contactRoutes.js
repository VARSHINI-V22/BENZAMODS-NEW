const express = require("express");
const nodemailer = require("nodemailer");
const ContactMessage = require("../models/ContactMessage");
const contactSchema = require("../utils/validateContact");

const router = express.Router();

// POST /api/contact - submit a contact message
router.post("/", async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, errors: error.details.map(d => d.message) });
    }

    // Save to DB
    const saved = await ContactMessage.create(value);

    // Optionally send email notification (if SMTP configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Benzamods Contact" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Contact Message",
        text: `Name: ${saved.name}\nEmail: ${saved.email}\nPhone: ${saved.phone}\n\nMessage:\n${saved.message}`,
      });
    }

    res.status(201).json({ ok: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// GET /api/contact - list messages (protected by ADMIN_TOKEN)
router.get("/", async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json({ ok: true, data: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
