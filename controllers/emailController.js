import { sendNotificationEmailService } from "../services/emailService.js";
import express from "express";

const router = express.Router();

router.post("/send-notification", async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    const messageId = await sendNotificationEmailService(to, subject, message);
    res.json({
      code: 200,
      message: "Email sent successfully",
      data: { messageId },
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

export default router;
