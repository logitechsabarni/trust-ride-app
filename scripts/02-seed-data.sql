-- Seed data for Trust Ride application
-- Provides initial test data for development and demonstration

-- Insert sample drivers
INSERT INTO drivers (name, license_number, rating, verified_on_blockchain, blockchain_tx) VALUES
('John Smith', 'DL123456789', 4.8, TRUE, '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'),
('Sarah Johnson', 'DL987654321', 4.9, TRUE, '0x2b3c4d5e6f7890ab1234567890abcdef1234567890'),
('Mike Davis', 'DL456789123', 4.7, TRUE, '0x3c4d5e6f7890abcd234567890abcdef1234567890ab'),
('Lisa Chen', 'DL789123456', 4.95, TRUE, '0x4d5e6f7890abcdef34567890abcdef1234567890abc'),
('Robert Wilson', 'DL321654987', 4.6, FALSE, NULL);

-- Insert sample users (passwords are hashed versions of 'password123')
INSERT INTO users (name, email, password_hash, guardian_contact) VALUES
('Alice Cooper', 'alice@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', '+1234567890'),
('Bob Martinez', 'bob@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', '+1987654321'),
('Carol White', 'carol@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', '+1555123456');

-- Insert sample rides
INSERT INTO rides (user_id, driver_id, pickup_location, destination, status, blockchain_tx, fare) VALUES
(1, 1, '123 Main St, Downtown', '456 Oak Ave, Uptown', 'completed', '0x5e6f7890abcdef123456789abcdef1234567890abcd', 25.50),
(2, 2, '789 Pine Rd, Westside', '321 Elm St, Eastside', 'active', '0x6f7890abcdef123456789abcdef1234567890abcde', 18.75),
(3, 3, '555 Maple Dr, Northside', '777 Cedar Ln, Southside', 'pending', NULL, 22.00);

-- Insert sample alerts
INSERT INTO alerts (ride_id, user_id, alert_type, location_lat, location_lng, location_address, tx_hash, status) VALUES
(2, 2, 'panic', 40.7128, -74.0060, '456 Broadway, New York, NY', '0x7890abcdef123456789abcdef1234567890abcdef1', 'verified');

-- Insert blockchain logs for tracking
INSERT INTO blockchain_logs (entity_type, entity_id, tx_hash, status, block_number, gas_used, verified_at) VALUES
('driver', 1, '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', 'verified', 18500000, 21000, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('driver', 2, '0x2b3c4d5e6f7890ab1234567890abcdef1234567890', 'verified', 18500001, 21000, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('ride', 1, '0x5e6f7890abcdef123456789abcdef1234567890abcd', 'verified', 18500002, 45000, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('alert', 1, '0x7890abcdef123456789abcdef1234567890abcdef1', 'verified', 18500003, 32000, CURRENT_TIMESTAMP - INTERVAL '2 hours');
