import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PUSHSAFER_KEY = process.env.PUSHSAFER_KEY;

export const sendPushNotificationService = async (title, message) => {
  try {
    const response = await axios.post("https://www.pushsafer.com/api", null, {
      params: {
        k: PUSHSAFER_KEY,
        t: title,
        m: message,
        s: 1, // sound
        v: 2, // vibration
        i: 1, // icon
        c: "#FF0000", // color
      },
    });
    console.log("✅ Đã gửi thông báo đẩy:", title);
    return response.data;
  } catch (err) {
    console.error("❌ Send push notification error:", err);
    throw err;
  }
};
