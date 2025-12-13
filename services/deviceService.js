import {
  getDeviceByUserId,
  updatePumpStatus,
  updateDeviceMode,
} from "../repo/deviceRepo.js";

export const fetchDeviceByUserIdService = async (user_id) => {
  const deviceRecord = await getDeviceByUserId(user_id);
  return deviceRecord;
};

export const changeDeviceModeService = async (user_id, mode) => {
  const updatedDevice = await updateDeviceMode(user_id, mode);
  return updatedDevice;
};

export const changePumpStatusService = async (user_id, pump_status) => {
  const updatedDevice = await updatePumpStatus(user_id, pump_status);
  return updatedDevice;
};
