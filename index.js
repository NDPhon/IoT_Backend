// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import userController from "./controllers/userController.js";

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

// Test route
const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
