import {
  getSystemConfigByUserId,
  updateSystemConfig,
} from "../repo/systemRepo.js";

export const fetchSystemConfigByUserIdService = async (user_id) => {
  const systemConfigRecord = await getSystemConfigByUserId(user_id);
  return systemConfigRecord;
};

export const modifySystemConfigService = async (
  user_id,
  moisture_threshold,
  air_humidity_threshold,
  temperature_limit,
  light_threshold
) => {
  const updatedSystemConfig = await updateSystemConfig(
    user_id,
    moisture_threshold,
    air_humidity_threshold,
    temperature_limit,
    light_threshold
  );
  return updatedSystemConfig;
};
