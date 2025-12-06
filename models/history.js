export class History {
  constructor(
    id,
    user_id,
    start_time,
    end_time,
    duration,
    mode,
    moisure_before,
    moisure_after,
    reason
  ) {
    this.id = id;
    this.user_id = user_id;
    this.start_time = start_time;
    this.end_time = end_time;
    this.duration = duration;
    this.mode = mode;
    this.moisure_before = moisure_before;
    this.moisure_after = moisure_after;
    this.reason = reason;
  }
}
