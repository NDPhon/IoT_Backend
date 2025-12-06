import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  registerUser,
  getUserById,
  getUserByUsername,
  loginUser,
} from "../repo/userRepo.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async (username, password) => {
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw new Error("Username đã được sử dụng. Vui lòng chọn username khác.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await registerUser(username, hashedPassword);

  const token = jwt.sign(
    { user_id: user.user_id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return token;
};

export const login = async (username, password) => {
  const user = await getUserByUsername(username);
  if (!user) throw new Error("Không tìm thấy user");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Mật khẩu không khớp");

  // Tạo JWT
  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return token;
};
