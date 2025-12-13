export class system {
  constructor(
    config_id,
    user_id,
    soil_moisture_threshold,
    air_humidity_threshold,
    temperature_limit,
    light_threshold,
    updated_at
  ) {
    this.config_id = config_id;
    this.user_id = user_id;
    this.soil_moisture_threshold = soil_moisture_threshold;
    this.air_humidity_threshold = air_humidity_threshold;
    this.temperature_limit = temperature_limit;
    this.light_threshold = light_threshold;
    this.updated_at = updated_at;
  }
}
