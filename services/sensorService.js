import {
  insertSensorData,
  getSensorDataByUserId,
  getCurrentSensorDataByUserId,
} from "../repo/sensorRepo.js";

export const addSensorDataService = async (
  nhiet_do,
  do_am_khong_khi,
  do_am_dat,
  muc_nuoc,
  anh_sang,
  user_id
) => {
  const sensorData = await insertSensorData(
    nhiet_do,
    do_am_khong_khi,
    do_am_dat,
    muc_nuoc,
    anh_sang,
    user_id
  );
  return sensorData;
};

export const fetchSensorDataByUserIdService = async (user_id) => {
  const sensorDataList = await getSensorDataByUserId(user_id);
  return sensorDataList;
};

export const fetchCurrentSensorDataByUserIdService = async (user_id) => {
  const sensorData = await getCurrentSensorDataByUserId(user_id);
  return sensorData;
};
