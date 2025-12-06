import { insertHistory, getHistoryByUserId } from "../repo/historyRepo.js";

export const addHistoryService = async (
  user_id,
  start_time,
  end_time,
  mode,
  moisure_before,
  moisure_after,
  reason
) => {
  const historyRecord = await insertHistory(
    user_id,
    start_time,
    end_time,
    mode,
    moisure_before,
    moisure_after,
    reason
  );
  return historyRecord;
};

export const fetchHistoryByUserIdService = async (user_id, page) => {
  const historyList = await getHistoryByUserId(user_id, page);
  return historyList;
};
