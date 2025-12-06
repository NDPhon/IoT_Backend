import pool from "../config/db.js";
import { Sensor } from "../models/sensor.js";

export const insertSensorData = async (
  nhiet_do,
  do_am_khong_khi,
  do_am_dat,
  muc_nuoc,
  anh_sang,
  user_id
) => {
  const query = `
    SELECT * FROM fnc_insert_sensor_data($1, $2, $3, $4, $5, $6);
  `;
  const values = [
    nhiet_do,
    do_am_khong_khi,
    do_am_dat,
    muc_nuoc,
    anh_sang,
    user_id,
  ];
  const res = await pool.query(query, values);
  const row = res.rows[0];
  return new Sensor(
    row.sensor_id,
    row.nhiet_do,
    row.do_am_khong_khi,
    row.do_am_dat,
    row.muc_nuoc,
    row.anh_sang,
    row.user_id
  );
};
export const getSensorDataByUserId = async (user_id) => {
  const query = `Select * from fnc_get_sensor_data($1);`;
  const values = [user_id];
  const res = await pool.query(query, values);
  return res.rows.map(
    (row) =>
      new Sensor(
        row.id,
        row.nhiet_do,
        row.do_am_khong_khi,
        row.do_am_dat,
        row.muc_nuoc,
        row.anh_sang,
        row.user_id,
        row.created_at
      )
  );
};

export const getCurrentSensorDataByUserId = async (user_id) => {
  const query = `Select * from fnc_get_current_sensor_data($1);`;
  const values = [user_id];
  const res = await pool.query(query, values);
  const row = res.rows[0];
  return new Sensor(
    row.id,
    row.nhiet_do,
    row.do_am_khong_khi,
    row.do_am_dat,
    row.muc_nuoc,
    row.anh_sang,
    row.user_id,
    row.created_at
  );
};
