
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hashed TEXT NOT NULL,
    is_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);

select * from users

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
