import pool from "../config/db.js";
import { device } from "../models/device.js";

export const getDeviceByUserId = async (user_id) => {
  const query = `
        SELECT control_id, user_id, mode, pump_status
        FROM device_control
        WHERE user_id = $1;
      `;
  const values = [user_id];
  const res = await pool.query(query, values);
  if (res.rows.length === 0) {
    return null; // Device not found
  }
  const row = res.rows[0];
  return new device(row.control_id, row.user_id, row.mode, row.pump_status);
};

export const updateDeviceMode = async (user_id, mode) => {
  const query = `
        SELECT * FROM fnc_update_mode($1, $2);
      `;
  const values = [user_id, mode];
  const res = await pool.query(query, values);
  const row = res.rows[0];
  return new device(row.control_id, row.user_id, row.mode, row.pump_status);
};

export const updatePumpStatus = async (user_id, pump_status) => {
  const query = `
        SELECT * FROM fnc_update_pump_status($1, $2);
      `;
  const values = [user_id, pump_status];
  const res = await pool.query(query, values);
  const row = res.rows[0];
  return new device(row.control_id, row.user_id, row.mode, row.pump_status);
};
