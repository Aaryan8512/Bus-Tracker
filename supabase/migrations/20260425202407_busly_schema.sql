/*
  # Busly - Smart Bus Tracking Platform Schema

  ## Overview
  Complete schema for the Busly real-time bus tracking application.

  ## New Tables
  1. `profiles` - Extended user profiles with roles (passenger, driver, admin)
  2. `routes` - Bus routes with source, destination, stops list
  3. `stops` - Individual bus stops with coordinates
  4. `route_stops` - Junction table linking routes to stops with order/ETA
  5. `buses` - Bus fleet with registration, capacity, current status
  6. `drivers` - Driver profiles linked to users and buses
  7. `trips` - Active and historical trip records
  8. `trip_locations` - Real-time GPS location history per trip
  9. `notifications` - User notifications for bus alerts
  10. `favorite_routes` - Saved routes per passenger

  ## Security
  - RLS enabled on all tables
  - Policies scoped by role and ownership
  - Public read for routes/stops/buses
  - Write restricted to owners/admins
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'passenger' CHECK (role IN ('passenger', 'driver', 'admin')),
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Stops table
CREATE TABLE IF NOT EXISTS stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stops"
  ON stops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert stops"
  ON stops FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update stops"
  ON stops FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_number text NOT NULL UNIQUE,
  name text NOT NULL,
  source text NOT NULL,
  destination text NOT NULL,
  distance_km decimal(8, 2) DEFAULT 0,
  avg_duration_mins integer DEFAULT 0,
  fare decimal(8, 2) DEFAULT 0,
  is_active boolean DEFAULT true,
  color text DEFAULT '#16a34a',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active routes"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert routes"
  ON routes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update routes"
  ON routes FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Route stops junction table
CREATE TABLE IF NOT EXISTS route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  stop_id uuid NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  stop_order integer NOT NULL,
  eta_from_start_mins integer DEFAULT 0,
  UNIQUE(route_id, stop_order)
);

ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view route stops"
  ON route_stops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage route stops"
  ON route_stops FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number text NOT NULL UNIQUE,
  model text DEFAULT '',
  capacity integer DEFAULT 50,
  current_passengers integer DEFAULT 0,
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'maintenance', 'offline')),
  route_id uuid REFERENCES routes(id) ON DELETE SET NULL,
  last_latitude decimal(10, 8),
  last_longitude decimal(11, 8),
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view buses"
  ON buses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert buses"
  ON buses FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update buses"
  ON buses FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number text NOT NULL UNIQUE,
  bus_id uuid REFERENCES buses(id) ON DELETE SET NULL,
  is_on_duty boolean DEFAULT false,
  rating decimal(3, 2) DEFAULT 5.00,
  total_trips integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view own record"
  ON drivers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert drivers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update drivers"
  ON drivers FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Drivers can update own record"
  ON drivers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  route_id uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  started_at timestamptz,
  ended_at timestamptz,
  current_stop_id uuid REFERENCES stops(id) ON DELETE SET NULL,
  next_stop_id uuid REFERENCES stops(id) ON DELETE SET NULL,
  current_latitude decimal(10, 8),
  current_longitude decimal(11, 8),
  speed_kmh decimal(5, 2) DEFAULT 0,
  delay_mins integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trips"
  ON trips FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM drivers WHERE user_id = auth.uid() AND id = trips.driver_id)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM drivers WHERE user_id = auth.uid() AND id = trips.driver_id)
  );

CREATE POLICY "Admins can insert trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trip locations (GPS trail)
CREATE TABLE IF NOT EXISTS trip_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  speed_kmh decimal(5, 2) DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE trip_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trip locations"
  ON trip_locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can insert location updates"
  ON trip_locations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips t
      JOIN drivers d ON d.id = t.driver_id
      WHERE t.id = trip_id AND d.user_id = auth.uid()
    )
  );

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'alert', 'success', 'warning')),
  is_read boolean DEFAULT false,
  trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Favorite routes
CREATE TABLE IF NOT EXISTS favorite_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_id uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, route_id)
);

ALTER TABLE favorite_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorite_routes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorite_routes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorite_routes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_bus_id ON trips(bus_id);
CREATE INDEX IF NOT EXISTS idx_trips_route_id ON trips(route_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trip_locations_trip_id ON trip_locations(trip_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
