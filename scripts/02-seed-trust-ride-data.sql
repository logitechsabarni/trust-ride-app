-- Seed data for Trust Ride

-- Insert sample verified drivers
INSERT INTO public.drivers (id, name, email, phone, license_number, vehicle_make, vehicle_model, vehicle_year, vehicle_plate, rating, is_verified, blockchain_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Driver', 'john.driver@example.com', '+1234567890', 'DL123456789', 'Toyota', 'Camry', 2022, 'ABC123', 4.8, true, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Wilson', 'sarah.wilson@example.com', '+1234567891', 'DL987654321', 'Honda', 'Civic', 2021, 'XYZ789', 4.9, true, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mike Johnson', 'mike.johnson@example.com', '+1234567892', 'DL456789123', 'Ford', 'Focus', 2023, 'DEF456', 4.7, true, false),
  ('550e8400-e29b-41d4-a716-446655440004', 'Lisa Chen', 'lisa.chen@example.com', '+1234567893', 'DL789123456', 'Nissan', 'Altima', 2022, 'GHI789', 4.9, true, true);

-- Insert sample blockchain logs for drivers
INSERT INTO public.blockchain_logs (record_type, record_id, transaction_hash, block_number, status, gas_used) VALUES
  ('driver_verification', '550e8400-e29b-41d4-a716-446655440001', '0x1234567890abcdef1234567890abcdef12345678', 18500000, 'confirmed', 21000),
  ('driver_verification', '550e8400-e29b-41d4-a716-446655440002', '0x2345678901bcdef12345678901bcdef123456789', 18500001, 'confirmed', 21000),
  ('driver_verification', '550e8400-e29b-41d4-a716-446655440004', '0x3456789012cdef123456789012cdef1234567890', 18500002, 'confirmed', 21000);
