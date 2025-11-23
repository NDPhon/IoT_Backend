import express from "express";
import axios from "axios";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/chatbot", authenticate, async (req, res) => {
  console.log("chatbot");
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Câu hỏi không được để trống." });
  }

  try {
    const response = await axios.post(
      "http://localhost:8888/plant-care-advice",
      { question }
    );

    res.json({
      code: 200,
      message: "Nhận câu trả lời",
      data: {
        advice: response.data.advice,
      },
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});
export default router;
