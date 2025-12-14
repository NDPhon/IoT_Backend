import {
  fetchDeviceByUserIdService,
  changeDeviceModeService,
  changePumpStatusService,
} from "../services/deviceService.js";
import { sendNotificationEmailService } from "../services/emailService.js";
import { sendPushNotificationService } from "../services/phoneNotiService.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { publishMode, publishPump } from "../cli/publisher.js";
import { getGroup7Mode } from "../cli/subscribe.js";

const router = express.Router();
router.get("/get", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // 1️⃣ Lấy từ DB
    const deviceRecord = await fetchDeviceByUserIdService(user_id);

    // 2️⃣ Lấy mode realtime từ MQTT (ESP32 button)
    const mqttMode = getGroup7Mode(); // "AUTO" | "MANUAL" | null

    // 3️⃣ Ưu tiên MQTT nếu có
    const deviceCurrent = {
      ...deviceRecord,
      mode: mqttMode ?? deviceRecord.mode,
      mode_source: mqttMode ? "mqtt" : "database",
    };

    res.json({
      code: 200,
      message: "Lấy thiết bị hiện tại thành công",
      data: deviceCurrent,
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: err.message,
      data: null,
    });
  }
});

router.patch("/change-mode", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { mode } = req.body;

    if (!["AUTO", "MANUAL"].includes(mode)) {
      return res.status(400).json({
        code: 400,
        message: "mode chỉ được là auto hoặc manual",
        data: null,
      });
    }

    // Update DB
    const updatedDevice = await changeDeviceModeService(user_id, mode);

    // Publish MQTT
    publishMode(mode);

    res.json({
      code: 200,
      message: "Cập nhật chế độ thiết bị thành công",
      data: updatedDevice,
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: err.message,
      data: null,
    });
  }
});

router.patch("/change-pump-status", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { pump_status } = req.body;

    if (![0, 1].includes(pump_status)) {
      return res.status(400).json({
        code: 400,
        message: "pump_status chỉ được là 0 hoặc 1",
        data: null,
      });
    }

    // Lấy trạng thái thiết bị hiện tại
    const device = await fetchDeviceByUserIdService(user_id);

    // Update DB
    const updatedDevice = await changePumpStatusService(user_id, pump_status);

    // Publish MQTT
    publishPump(pump_status);

    if (pump_status === 1) {
      await sendNotificationEmailService(
        "ndphon23@clc.fitus.edu.vn",
        "EcoSystem",
        `Hệ thống vừa tưới cây ở chế độ ${device.mode}`
      );
      await sendPushNotificationService(
        "EcoSystem",
        `Hệ thống vừa tưới cây ở chế độ ${device.mode}`
      );
    }

    res.json({
      code: 200,
      message: "Cập nhật trạng thái bơm thành công",
      data: updatedDevice,
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: err.message,
      data: null,
    });
  }
});
export default router;
