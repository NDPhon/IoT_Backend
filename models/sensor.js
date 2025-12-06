export class Sensor {
  constructor(
    sensor_id,
    nhiet_do,
    do_am_khong_khi,
    do_am_dat,
    muc_nuoc,
    anh_sang,
    user_id,
    created_at
  ) {
    this.sensor_id = sensor_id;
    this.nhiet_do = nhiet_do;
    this.do_am_khong_khi = do_am_khong_khi;
    this.do_am_dat = do_am_dat;
    this.muc_nuoc = muc_nuoc;
    this.anh_sang = anh_sang;
    this.user_id = user_id;
    this.created_at = created_at;
  }
}
