-- Trust Ride Database Schema
-- Creates all necessary tables for the ride-sharing safety application

-- Users table for authentication and profile management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    guardian_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table for verified driver information
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.00,
    verified_on_blockchain BOOLEAN DEFAULT FALSE,
    blockchain_tx VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rides table for tracking all ride bookings and status
CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, completed, cancelled
    blockchain_tx VARCHAR(255),
    fare DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table for safety panic button and emergency situations
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER REFERENCES rides(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) DEFAULT 'panic', -- panic, emergency, suspicious
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_address TEXT,
    tx_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, verified, resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain logs table for tracking all blockchain transactions
CREATE TABLE IF NOT EXISTS blockchain_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- driver, ride, alert
    entity_id INTEGER NOT NULL,
    tx_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, verified, failed
    block_number INTEGER,
    gas_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_alerts_ride_id ON alerts(ride_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_logs_entity ON blockchain_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_logs_tx_hash ON blockchain_logs(tx_hash);
