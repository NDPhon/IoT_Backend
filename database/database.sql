select * from users
select * from watering_history

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hashed TEXT NOT NULL,
    is_created TIMESTAMPTZ DEFAULT NOW(),
    status BOOLEAN DEFAULT TRUE
);

select * from users;

CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    nhiet_do NUMERIC(5,2),        -- Nhiệt độ (°C)
    do_am_khong_khi NUMERIC(5,2), -- Độ ẩm không khí (%)
    do_am_dat NUMERIC(5,2),       -- Độ ẩm đất (%)
    muc_nuoc NUMERIC(10,2),       -- Mực nước (cm hoặc mm tuỳ cảm biến)
    anh_sang NUMERIC(10,2),       -- Cường độ ánh sáng (lux)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id INT
);
CREATE TABLE watering_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,                     
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration INTERVAL NOT NULL,
    mode VARCHAR(20) NOT NULL,                
    moisture_before INT NOT NULL,
    moisture_after INT NOT NULL,
    reason TEXT NOT NULL
);

CREATE TABLE system_config (
    config_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,

    soil_moisture_threshold INT NOT NULL DEFAULT 50,
    air_humidity_threshold INT NOT NULL DEFAULT 40,
    temperature_limit INT NOT NULL DEFAULT 35,
    light_threshold INT NOT NULL DEFAULT 80,

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE device_control (
    control_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,

    mode VARCHAR(10) NOT NULL DEFAULT 'AUTO',   -- AUTO | MANUAL
    pump_status VARCHAR(10) NOT NULL DEFAULT 'OFF',  -- ON | OFF

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_device_control
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
