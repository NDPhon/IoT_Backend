import {
  fetchSystemConfigByUserIdService,
  modifySystemConfigService,
} from "../services/systemService.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/get", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const systemConfigRecord = await fetchSystemConfigByUserIdService(user_id);
    res.json({
      code: 200,
      message: "Lấy cấu hình hệ thống thành công",
      data: systemConfigRecord,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

router.patch("/modify", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {
      moisture_threshold,
      humidity_threshold,
      temperature_limit,
      light_threshold,
    } = req.body;
    const updatedSystemConfig = await modifySystemConfigService(
      user_id,
      moisture_threshold,
      humidity_threshold,
      temperature_limit,
      light_threshold
    );
    res.json({
      code: 200,
      message: "Cập nhật cấu hình hệ thống thành công",
      data: updatedSystemConfig,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});
export default router;
