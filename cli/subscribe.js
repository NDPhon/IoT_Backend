import mqtt from "mqtt";

const MQTT_BROKER = "mqtt://broker.hivemq.com:1883";
const client = mqtt.connect(MQTT_BROKER);

// Cache dữ liệu mới nhất
// group7 => { temperature_humidity, soil_light, water_level, mode }
const latestSensorData = new Map();

client.on("connect", () => {
  console.log("✅ Subscriber connected to MQTT");

  client.subscribe([
    "iot/+/sensor",
    "plantcare/group7/temperature_humidity",
    "plantcare/group7/soil_light",
    "plantcare/group7/water_level",
    "plantcare/group7/mode", // 🔥 THÊM TOPIC MODE
  ]);

  console.log("📡 Subscribed group7 topics (sensor + mode)");
});

client.on("message", (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());

    /* =============================
       GROUP 7 – TOPICS
       ============================= */
    if (topic.startsWith("plantcare/group7/")) {
      if (!latestSensorData.has("group7")) {
        latestSensorData.set("group7", {});
      }

      const group7Data = latestSensorData.get("group7");

      if (topic.endsWith("temperature_humidity")) {
        group7Data.temperature_humidity = payload;
      }

      if (topic.endsWith("soil_light")) {
        group7Data.soil_light = payload;
      }

      if (topic.endsWith("water_level")) {
        group7Data.water_level = payload;
      }

      if (topic.endsWith("mode")) {
        group7Data.mode = payload.mode;
      }

      latestSensorData.set("group7", group7Data);
      return;
    }

    /* =============================
       USER SENSOR (iot/{id}/sensor)
       ============================= */
    if (topic.startsWith("iot/")) {
      const { user_id } = payload;
      latestSensorData.set(user_id, payload);
    }
  } catch (err) {
    console.error("❌ MQTT parse error:", err.message);
  }
});

/* =========================
   HÀM TRẢ PAYLOAD
   ========================= */

// Lấy toàn bộ dữ liệu group7
export function getGroup7Data() {
  return latestSensorData.get("group7") || null;
}

// Sensor riêng lẻ
export function getGroup7TemperatureHumidity() {
  return latestSensorData.get("group7")?.temperature_humidity || null;
}

export function getGroup7SoilLight() {
  return latestSensorData.get("group7")?.soil_light || null;
}

export function getGroup7WaterLevel() {
  return latestSensorData.get("group7")?.water_level || null;
}

// 🔥 MODE
export function getGroup7Mode() {
  return latestSensorData.get("group7")?.mode || null;
}
