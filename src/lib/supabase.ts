import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'passenger' | 'driver' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface Stop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  route_number: string;
  name: string;
  source: string;
  destination: string;
  distance_km: number;
  avg_duration_mins: number;
  fare: number;
  is_active: boolean;
  color: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_id: string;
  stop_order: number;
  eta_from_start_mins: number;
  stops?: Stop;
}

export interface Bus {
  id: string;
  registration_number: string;
  model: string;
  capacity: number;
  current_passengers: number;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  route_id: string | null;
  last_latitude: number | null;
  last_longitude: number | null;
  last_seen: string;
}

export interface Driver {
  id: string;
  user_id: string;
  license_number: string;
  bus_id: string | null;
  is_on_duty: boolean;
  rating: number;
  total_trips: number;
}

export interface Trip {
  id: string;
  bus_id: string;
  route_id: string;
  driver_id: string | null;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  started_at: string | null;
  ended_at: string | null;
  current_stop_id: string | null;
  next_stop_id: string | null;
  current_latitude: number | null;
  current_longitude: number | null;
  speed_kmh: number;
  delay_mins: number;
  created_at: string;
  routes?: Route;
  buses?: Bus;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  is_read: boolean;
  trip_id: string | null;
  created_at: string;
}

export interface FavoriteRoute {
  id: string;
  user_id: string;
  route_id: string;
  created_at: string;
  routes?: Route;
}
