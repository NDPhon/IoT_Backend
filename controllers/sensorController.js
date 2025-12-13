import {
  addSensorDataService,
  fetchSensorDataByUserIdService,
  fetchCurrentSensorDataByUserIdService,
} from "../services/sensorService.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";
const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const {
      nhiet_do,
      do_am_khong_khi,
      do_am_dat,
      muc_nuoc,
      anh_sang,
      created_at,
    } = req.body;
    const user_id = req.user.user_id;
    const sensorData = await addSensorDataService(
      nhiet_do,
      do_am_khong_khi,
      do_am_dat,
      muc_nuoc,
      anh_sang,
      user_id,
      created_at
    );
    res.json({
      code: 200,
      message: "Thêm dữ liệu cảm biến thành công",
      data: sensorData,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const sensorDataList = await fetchSensorDataByUserIdService(user_id);
    res.json({
      code: 200,
      message: "Lấy dữ liệu cảm biến thành công",
      data: sensorDataList,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

router.get("/current", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const sensorData = await fetchCurrentSensorDataByUserIdService(user_id);
    res.json({
      code: 200,
      message: "Lấy dữ liệu cảm biến hiện tại thành công",
      data: sensorData,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});
export default router;
