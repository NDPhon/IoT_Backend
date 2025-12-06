import pool from "../config/db.js";
import { User } from "../models/user.js";

// Tạo user mới
export const registerUser = async (username, password) => {
  const query = `
      SELECT * FROM fnc_register_user($1, $2);
  `;
  const values = [username, password];
  const res = await pool.query(query, values);
  const row = res.rows[0];
  return new User(row.user_id, row.username, row.password_hashed);
};

export const getUserByUsername = async (username) => {
  const query = `
        SELECT user_id, username, password_hashed
        FROM users
        WHERE username = $1;
      `;
  const values = [username];
  const res = await pool.query(query, values);
  if (res.rows.length === 0) {
    return null; // User not found
  }
  const row = res.rows[0];
  return new User(row.user_id, row.username, row.password_hashed);
};

export const getUserById = async (user_id) => {
  const query = `
        SELECT user_id, username, password_hashed   
        FROM users
        WHERE user_id = $1;
      `;
  const values = [user_id];
  const res = await pool.query(query, values);
  if (res.rows.length === 0) {
    return null; // User not found
  }
  const row = res.rows[0];
  return new User(row.user_id, row.username, row.password_hashed);
};

export const loginUser = async (username, password) => {
  const result = await pool.query("SELECT * FROM fnc_login_user($1, $2)", [
    username,
    password,
  ]);
  return result.rows[0]; // Có thể null nếu không đúng
};
