import pool from "../config/db.js";
import { system } from "../models/system.js";

export const getSystemConfigByUserId = async (user_id) => {
  const query = `
        SELECT config_id, user_id, soil_moisture_threshold, air_humidity_threshold, temperature_limit, light_threshold, updated_at
        FROM system_config
        WHERE user_id = $1;
      `;
  const values = [user_id];
  const res = await pool.query(query, values);
  if (res.rows.length === 0) {
    return null; // System config not found
  }
  const row = res.rows[0];
  return new system(
    row.config_id,
    row.user_id,
    row.soil_moisture_threshold,
    row.air_humidity_threshold,
    row.temperature_limit,
    row.light_threshold,
    row.updated_at
  );
};

export const updateSystemConfig = async (
  user_id,
  soil_moisture_threshold,
  air_humidity_threshold,
  temperature_limit,
  light_threshold
) => {
  const query = `
        SELECT * FROM fnc_update_system_config($1, $2, $3, $4, $5);
        `;
  const values = [
    user_id,
    soil_moisture_threshold,
    air_humidity_threshold,
    temperature_limit,
    light_threshold,
  ];
  const res = await pool.query(query, values);
  const row = res.rows[0];
  return new system(
    row.config_id,
    row.user_id,
    row.soil_moisture_threshold,
    row.air_humidity_threshold,
    row.temperature_limit,
    row.light_threshold,
    row.updated_at
  );
};
