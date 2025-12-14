// src/service/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

export const sendNotificationEmailService = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });

    console.log("✅ Đã gửi email:", to);
    return info.messageId;
  } catch (err) {
    console.error("❌ Send email error:", err);
    throw err;
  }
};
