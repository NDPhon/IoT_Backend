delete from users
select * from users
select * from watering_history
delete from sensor_data
select * from sensor_data
select * from device_control
select * from system_config
CREATE OR REPLACE FUNCTION fnc_register_user(
    p_username VARCHAR,
    p_password_hashed TEXT
)
RETURNS TABLE (
    user_id INT,
    username VARCHAR,
    is_created TIMESTAMPTZ
)
LANGUAGE plpgsql AS
$$
DECLARE 
    new_user_id INT;
BEGIN
    -- 1. Tạo user mới
    INSERT INTO users (username, password_hashed)
    VALUES (p_username, p_password_hashed)
    RETURNING users.user_id INTO new_user_id;

    -- 2. Tạo system_config cho user
    INSERT INTO system_config (user_id)
    VALUES (new_user_id);

    -- 3. Tạo device_control cho user
    INSERT INTO device_control (user_id)
    VALUES (new_user_id);

    -- 4. Trả kết quả
    RETURN QUERY
    SELECT 
        u.user_id,
        u.username,
        u.is_created
    FROM users u
    WHERE u.user_id = new_user_id;

END;
$$;


CREATE OR REPLACE FUNCTION fnc_login_user(
    p_username VARCHAR,
    p_password_hashed TEXT
)
RETURNS TABLE(
    user_id INT,
    username VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT user_id, username
    FROM users
    WHERE username = p_username
      AND password_hashed = p_password_hashed;
    
END;
$$ LANGUAGE plpgsql;
drop function fnc_insert_sensor_data
CREATE OR REPLACE FUNCTION fnc_insert_sensor_data(
    _nhiet_do NUMERIC,
    _do_am_khong_khi NUMERIC,
    _do_am_dat NUMERIC,
    _muc_nuoc NUMERIC,
    _anh_sang NUMERIC,
    _user_id INT,
	_created_at TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO sensor_data (
        nhiet_do,
        do_am_khong_khi,
        do_am_dat,
        muc_nuoc,
        anh_sang,
        user_id,
		created_at
    ) VALUES (
        _nhiet_do,
        _do_am_khong_khi,
        _do_am_dat,
        _muc_nuoc,
        _anh_sang,
        _user_id,
		_created_at
    );
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS fnc_get_sensor_data(INT);
CREATE OR REPLACE FUNCTION fnc_get_sensor_data(_user_id INT)
RETURNS TABLE (
    id INT,
    nhiet_do NUMERIC,
    do_am_khong_khi NUMERIC,
    do_am_dat NUMERIC,
    muc_nuoc NUMERIC,
    anh_sang NUMERIC,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.nhiet_do,
        s.do_am_khong_khi,
        s.do_am_dat,
        s.muc_nuoc,
        s.anh_sang,
        s.created_at 
    FROM sensor_data s
    WHERE s.user_id = _user_id
    ORDER BY s.created_at DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS fnc_get_current_sensor_data(INT);
CREATE OR REPLACE FUNCTION fnc_get_current_sensor_data(_user_id INT)
RETURNS TABLE (
    id INT,
    nhiet_do NUMERIC,
    do_am_khong_khi NUMERIC,
    do_am_dat NUMERIC,
    muc_nuoc NUMERIC,
    anh_sang NUMERIC,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.nhiet_do,
        s.do_am_khong_khi,
        s.do_am_dat,
        s.muc_nuoc,
        s.anh_sang,
        s.created_at
    FROM sensor_data s
    WHERE s.user_id = _user_id
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_insert_history(
    p_user_id INT,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_mode VARCHAR,
    p_moisture_before INT,
    p_moisture_after INT,
    p_reason TEXT
)
RETURNS INT AS $$
DECLARE
    new_id INT;
BEGIN
    INSERT INTO watering_history (
        user_id,
        start_time,
        end_time,
        duration,
        mode,
        moisture_before,
        moisture_after,
        reason
    )
    VALUES (
        p_user_id,
        p_start_time,
        p_end_time,
        (p_end_time - p_start_time),   -- Tính duration tự động
        p_mode,
        p_moisture_before,
        p_moisture_after,
        p_reason
    )
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_get_history(
    p_user_id INT,
    p_page INT DEFAULT 1
)
RETURNS TABLE (
    id INT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration INTERVAL,
    mode VARCHAR,
    moisture_before INT,
    moisture_after INT,
    reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        h.id,
        h.start_time,
        h.end_time,
        h.duration,
        h.mode,
        h.moisture_before,
        h.moisture_after,
        h.reason
    FROM watering_history h
    WHERE h.user_id = p_user_id
    ORDER BY h.start_time DESC
    LIMIT 6
    OFFSET (p_page - 1) * 6;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_update_system_config(
    p_user_id INT,
    p_soil_moisture_threshold INT,
    p_air_humidity_threshold INT,
    p_temperature_limit INT,
    p_light_threshold INT
)
RETURNS TABLE (
    user_id INT,
    soil_moisture_threshold INT,
    air_humidity_threshold INT,
    temperature_limit INT,
    light_threshold INT,
    updated_at TIMESTAMP
)
LANGUAGE plpgsql AS
$$
BEGIN
    UPDATE system_config
    SET 
        soil_moisture_threshold = p_soil_moisture_threshold,
        air_humidity_threshold = p_air_humidity_threshold,
        temperature_limit = p_temperature_limit,
        light_threshold = p_light_threshold,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN QUERY
    SELECT 
        user_id,
        soil_moisture_threshold,
        air_humidity_threshold,
        temperature_limit,
        light_threshold,
        updated_at
    FROM system_config
    WHERE user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION fnc_update_mode(
    p_user_id INT,
    p_mode VARCHAR
)
RETURNS TABLE (
    user_id INT,
    mode VARCHAR,
    pump_status VARCHAR,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql AS
$$
BEGIN
    UPDATE device_control
    SET 
        mode = p_mode,
        updated_at = NOW()
    WHERE user_id = p_user_id;

	IF p_mode = 'AUTO' THEN
    UPDATE device_control
    SET pump_status = 'OFF'
    WHERE user_id = p_user_id;
END IF;


    RETURN QUERY
    SELECT user_id, mode, pump_status, updated_at
    FROM device_control
    WHERE user_id = p_user_id;
END;
$$;
drop function fnc_update_pump_status
SELECT
    proname AS function_name,
    COUNT(*) AS total
FROM pg_proc
WHERE proname = 'fnc_update_pump_status'
GROUP BY proname;
CREATE OR REPLACE FUNCTION fnc_update_pump_status(
    p_user_id INT,
    p_pump_status VARCHAR
)
RETURNS TABLE (
    user_id INT,
    mode VARCHAR,
    pump_status VARCHAR,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql AS
$$
DECLARE
    v_mode VARCHAR;
BEGIN
    -- Lấy mode hiện tại
    SELECT dc.mode
    INTO v_mode
    FROM device_control AS dc
    WHERE dc.user_id = p_user_id;

    -- Cập nhật pump_status
    UPDATE device_control AS dc
    SET 
        pump_status = p_pump_status,
        updated_at = NOW()
    WHERE dc.user_id = p_user_id;

    -- Trả về dữ liệu sau khi update
    RETURN QUERY
    SELECT 
        dc.user_id,
        dc.mode,
        dc.pump_status,
        dc.updated_at
    FROM device_control AS dc
    WHERE dc.user_id = p_user_id;
END;
$$;


