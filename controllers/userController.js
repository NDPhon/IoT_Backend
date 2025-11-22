import express from "express";
import { register, login } from "../services/userService.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await register(username, password);
    res.json({
      code: 200,
      message: "Đăng ký thành công",
      data: {
        token: token,
      },
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

router.post("/login", async (req, res) => {
  console.log("login entry");
  try {
    const { username, password } = req.body;
    const token = await login(username, password);

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      data: { token },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({
      code: 400,
      message: err.message,
      data: null,
    });
  }
});

export default router;
