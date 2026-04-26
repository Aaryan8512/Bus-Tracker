/*
  # Busly Seed Data

  Inserts realistic demo data including:
  - 8 bus stops around a city grid
  - 4 bus routes
  - 6 buses
  - Sample trips (active and historical)
*/

-- Insert stops (simulated city stops)
INSERT INTO stops (id, name, address, latitude, longitude) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Central Station', 'Central Station, Main Street', 40.7128, -74.0060),
  ('11111111-1111-1111-1111-111111111002', 'City Hall', 'City Hall Plaza, Downtown', 40.7142, -74.0064),
  ('11111111-1111-1111-1111-111111111003', 'Market Square', 'Market Square, Midtown', 40.7168, -74.0050),
  ('11111111-1111-1111-1111-111111111004', 'University Gate', 'University Blvd, Campus Area', 40.7195, -74.0035),
  ('11111111-1111-1111-1111-111111111005', 'Airport Terminal', 'International Airport, T1', 40.6413, -73.7781),
  ('11111111-1111-1111-1111-111111111006', 'West Park', 'West Park Avenue, Greenway', 40.7282, -74.0776),
  ('11111111-1111-1111-1111-111111111007', 'Harbor Point', 'Harbor Dr, Waterfront', 40.6892, -74.0445),
  ('11111111-1111-1111-1111-111111111008', 'North Junction', 'North Ave Junction, Uptown', 40.7580, -73.9855),
  ('11111111-1111-1111-1111-111111111009', 'East Gate Mall', 'East Gate Shopping Center', 40.7282, -73.9442),
  ('11111111-1111-1111-1111-111111111010', 'Tech District', 'Innovation Hub, Silicon Blvd', 40.7489, -73.9680)
ON CONFLICT (id) DO NOTHING;

-- Insert routes
INSERT INTO routes (id, route_number, name, source, destination, distance_km, avg_duration_mins, fare, is_active, color) VALUES
  ('22222222-2222-2222-2222-222222222001', 'BL-101', 'Central Express', 'Central Station', 'Airport Terminal', 28.5, 55, 3.50, true, '#16a34a'),
  ('22222222-2222-2222-2222-222222222002', 'BL-202', 'City Loop', 'City Hall', 'City Hall', 18.2, 45, 2.50, true, '#0891b2'),
  ('22222222-2222-2222-2222-222222222003', 'BL-303', 'University Shuttle', 'Central Station', 'University Gate', 12.0, 25, 1.75, true, '#d97706'),
  ('22222222-2222-2222-2222-222222222004', 'BL-404', 'Harbor Connector', 'City Hall', 'Harbor Point', 9.8, 22, 2.00, true, '#dc2626')
ON CONFLICT (id) DO NOTHING;

-- Route stops for BL-101 (Central Express)
INSERT INTO route_stops (route_id, stop_id, stop_order, eta_from_start_mins) VALUES
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111001', 1, 0),
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111002', 2, 8),
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111003', 3, 18),
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111007', 4, 32),
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111005', 5, 55)
ON CONFLICT DO NOTHING;

-- Route stops for BL-202 (City Loop)
INSERT INTO route_stops (route_id, stop_id, stop_order, eta_from_start_mins) VALUES
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111002', 1, 0),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111003', 2, 10),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111006', 3, 22),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111008', 4, 33),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111002', 5, 45)
ON CONFLICT DO NOTHING;

-- Route stops for BL-303 (University Shuttle)
INSERT INTO route_stops (route_id, stop_id, stop_order, eta_from_start_mins) VALUES
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111001', 1, 0),
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111002', 2, 6),
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111003', 3, 14),
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111004', 4, 25)
ON CONFLICT DO NOTHING;

-- Route stops for BL-404 (Harbor Connector)
INSERT INTO route_stops (route_id, stop_id, stop_order, eta_from_start_mins) VALUES
  ('22222222-2222-2222-2222-222222222004', '11111111-1111-1111-1111-111111111002', 1, 0),
  ('22222222-2222-2222-2222-222222222004', '11111111-1111-1111-1111-111111111001', 2, 7),
  ('22222222-2222-2222-2222-222222222004', '11111111-1111-1111-1111-111111111007', 3, 22)
ON CONFLICT DO NOTHING;

-- Insert buses
INSERT INTO buses (id, registration_number, model, capacity, current_passengers, status, route_id, last_latitude, last_longitude) VALUES
  ('33333333-3333-3333-3333-333333333001', 'BUS-001', 'Volvo 9700', 54, 32, 'active', '22222222-2222-2222-2222-222222222001', 40.7145, -74.0061),
  ('33333333-3333-3333-3333-333333333002', 'BUS-002', 'Mercedes Citaro', 70, 45, 'active', '22222222-2222-2222-2222-222222222002', 40.7175, -74.0052),
  ('33333333-3333-3333-3333-333333333003', 'BUS-003', 'MAN Lion City', 60, 18, 'active', '22222222-2222-2222-2222-222222222003', 40.7155, -74.0058),
  ('33333333-3333-3333-3333-333333333004', 'BUS-004', 'Scania Citywide', 65, 0, 'idle', NULL, 40.7128, -74.0060),
  ('33333333-3333-3333-3333-333333333005', 'BUS-005', 'Volvo 8900', 50, 29, 'active', '22222222-2222-2222-2222-222222222004', 40.6950, -74.0200),
  ('33333333-3333-3333-3333-333333333006', 'BUS-006', 'Mercedes CapaCity', 120, 0, 'maintenance', NULL, 40.7100, -74.0100)
ON CONFLICT (id) DO NOTHING;
