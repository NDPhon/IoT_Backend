import {
  fetchHistoryByUserIdService,
  addHistoryService,
} from "../services/historyService.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";
const router = express.Router();

router.post("/add", authenticate, async (req, res) => {
  try {
    const {
      start_time,
      end_time,
      mode,
      moisure_before,
      moisure_after,
      reason,
    } = req.body;
    const user_id = req.user.user_id;
    const historyRecord = await addHistoryService(
      user_id,
      start_time,
      end_time,
      mode,
      moisure_before,
      moisure_after,
      reason
    );
    res.json({
      code: 200,
      message: "Thêm lịch sử thành công",
      data: historyRecord,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});

router.get("/get", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const page = req.query.page || 1;
    const historyList = await fetchHistoryByUserIdService(user_id, page);
    res.json({
      code: 200,
      message: "Lấy lịch sử thành công",
      data: historyList,
    });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message, data: null });
  }
});
export default router;
