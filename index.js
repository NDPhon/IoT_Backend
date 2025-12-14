// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userController from "./controllers/userController.js";
import chatbotController from "./controllers/chatbotController.js";
import sensorController from "./controllers/sensorController.js";
import historyController from "./controllers/historyController.js";
import deviceController from "./controllers/deviceController.js";
import systemController from "./controllers/systemController.js";
import emailController from "./controllers/emailController.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/users", userController);
app.use("/api/chat", chatbotController);
app.use("/api/sensors", sensorController);
app.use("/api/history", historyController);
app.use("/api/device", deviceController);
app.use("/api/system", systemController);
app.use("/api/email", emailController);

// Test route
const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
