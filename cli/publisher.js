import mqtt from "mqtt";

const MQTT_BROKER = "mqtt://broker.hivemq.com:1883";
const client = mqtt.connect(MQTT_BROKER);

const MODE_TOPIC = "plantcare/group7/device/mode";
const PUMP_TOPIC = "plantcare/group7/device/pump";

client.on("connect", () => {
  console.log("✅ MQTT Publisher connected");
});

/**
 * Publish đổi chế độ
 * @param {"auto" | "manual"} mode
 */
export function publishMode(mode) {
  const payload = {
    mode,
    created_at: new Date().toISOString(),
    source: "backend",
  };

  client.publish(MODE_TOPIC, JSON.stringify(payload));
  console.log("📤 Publish MODE:", payload);
}

/**
 * Publish bật / tắt bơm
 * @param {0 | 1} pump_status
 */
export function publishPump(pump_status) {
  const payload = {
    pump: pump_status, // 1 = ON, 0 = OFF
    created_at: new Date().toISOString(),
    source: "backend",
  };

  client.publish(PUMP_TOPIC, JSON.stringify(payload));
  console.log("🚰 Publish PUMP:", payload);
}

export default client;
