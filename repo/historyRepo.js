import { History } from "../models/history.js";
import pool from "../config/db.js";

export const insertHistory = async (
  user_id,
  start_time,
  end_time,

  mode,
  moisure_before,
  moisure_after,
  reason
) => {
  const query = `
    SELECT * FROM fnc_insert_history($1, $2, $3, $4, $5, $6, $7);
  `;
  const values = [
    user_id,
    start_time,
    end_time,
    mode,
    moisure_before,
    moisure_after,
    reason,
  ];
  const res = await pool.query(query, values);
  const row = res.rows[0];
  return new History(
    row.id,
    row.user_id,
    row.start_time,
    row.end_time,
    row.duration,
    row.mode,
    row.moisure_before,
    row.moisure_after,
    row.reason
  );
};

export const getHistoryByUserId = async (user_id, page) => {
  const query = `SELECT * FROM fnc_get_history($1, $2);`;
  const values = [user_id, page];
  const res = await pool.query(query, values);
  return res.rows.map(
    (row) =>
      new History(
        row.id,
        row.user_id,
        row.start_time,
        row.end_time,
        row.duration,
        row.mode,
        row.moisure_before,
        row.moisure_after,
        row.reason
      )
  );
};
