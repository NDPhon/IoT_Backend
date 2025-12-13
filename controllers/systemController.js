import {
  fetchSystemConfigByUserIdService,
  modifySystemConfigService,
} from "../services/systemService.js";
import express from "express";
import { publishPump } from "../cli/publisher.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { pump } = req.body;

    if (pump !== 0 && pump !== 1) {
      return res.status(400).json({
        code: 400,
        message: "pump phải là 0 hoặc 1",
        data: null,
      });
    }

    // Gửi lệnh MQTT
    publishPump(pump === 1);

    res.json({
      code: 200,
      message: pump === 1 ? "Bật máy bơm" : "Tắt máy bơm",
      data: { pump },
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err.message,
      data: null,
    });
  }
});

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
