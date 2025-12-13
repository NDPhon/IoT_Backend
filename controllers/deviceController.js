import {
  fetchDeviceByUserIdService,
  changeDeviceModeService,
  changePumpStatusService,
} from "../services/deviceService.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();
router.get("/get", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const deviceRecord = await fetchDeviceByUserIdService(user_id);
    res.json({
      code: 200,
      message: "Lấy thiết bị thành công",
      data: deviceRecord,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

router.patch("/change-mode", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { mode } = req.body;
    const updatedDevice = await changeDeviceModeService(user_id, mode);
    res.json({
      code: 200,
      message: "Cập nhật chế độ thiết bị thành công",
      data: updatedDevice,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

router.patch("/change-pump-status", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { pump_status } = req.body;
    const updatedDevice = await changePumpStatusService(user_id, pump_status);
    res.json({
      code: 200,
      message: "Cập nhật trạng thái bơm thành công",
      data: updatedDevice,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});
export default router;
