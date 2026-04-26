import { useState, useEffect, useRef } from 'react';

export interface SimulatedBus {
  id: string;
  busNumber: string;
  routeNumber: string;
  routeName: string;
  color: string;
  lat: number;
  lng: number;
  speed: number;
  passengers: number;
  capacity: number;
  nextStop: string;
  eta: number;
  status: 'active' | 'idle';
  heading: number;
}

const ROUTES = [
  {
    id: '1', routeNumber: 'BL-101', routeName: 'Central Express', color: '#16a34a',
    stops: [
      { name: 'Central Station', lat: 40.7128, lng: -74.0060 },
      { name: 'City Hall', lat: 40.7142, lng: -74.0064 },
      { name: 'Market Square', lat: 40.7168, lng: -74.0050 },
      { name: 'Harbor Point', lat: 40.6892, lng: -74.0445 },
      { name: 'Airport Terminal', lat: 40.6413, lng: -73.7781 },
    ]
  },
  {
    id: '2', routeNumber: 'BL-202', routeName: 'City Loop', color: '#0891b2',
    stops: [
      { name: 'City Hall', lat: 40.7142, lng: -74.0064 },
      { name: 'Market Square', lat: 40.7168, lng: -74.0050 },
      { name: 'West Park', lat: 40.7282, lng: -74.0776 },
      { name: 'North Junction', lat: 40.7580, lng: -73.9855 },
    ]
  },
  {
    id: '3', routeNumber: 'BL-303', routeName: 'University Shuttle', color: '#d97706',
    stops: [
      { name: 'Central Station', lat: 40.7128, lng: -74.0060 },
      { name: 'City Hall', lat: 40.7142, lng: -74.0064 },
      { name: 'Market Square', lat: 40.7168, lng: -74.0050 },
      { name: 'University Gate', lat: 40.7195, lng: -74.0035 },
    ]
  },
  {
    id: '4', routeNumber: 'BL-404', routeName: 'Harbor Connector', color: '#dc2626',
    stops: [
      { name: 'City Hall', lat: 40.7142, lng: -74.0064 },
      { name: 'Central Station', lat: 40.7128, lng: -74.0060 },
      { name: 'Harbor Point', lat: 40.6892, lng: -74.0445 },
    ]
  },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function calcHeading(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dLng = lng2 - lng1;
  const dLat = lat2 - lat1;
  return (Math.atan2(dLng, dLat) * 180) / Math.PI;
}

export function useSimulatedTrips() {
  const [buses, setBuses] = useState<SimulatedBus[]>([]);
  const progressRef = useRef<Record<string, { stopIdx: number; t: number }>>({});

  useEffect(() => {
    const initial: SimulatedBus[] = ROUTES.flatMap((route, ri) =>
      [0, 1].map((bi) => {
        const busId = `${route.id}-${bi}`;
        const startStop = (ri + bi) % route.stops.length;
        progressRef.current[busId] = { stopIdx: startStop, t: Math.random() };
        const stop = route.stops[startStop];
        return {
          id: busId,
          busNumber: `BUS-00${ri * 2 + bi + 1}`,
          routeNumber: route.routeNumber,
          routeName: route.routeName,
          color: route.color,
          lat: stop.lat,
          lng: stop.lng,
          speed: 25 + Math.random() * 20,
          passengers: Math.floor(Math.random() * 50),
          capacity: 60,
          nextStop: route.stops[(startStop + 1) % route.stops.length].name,
          eta: Math.floor(3 + Math.random() * 12),
          status: 'active' as const,
          heading: 0,
        };
      })
    );
    setBuses(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        const route = ROUTES.find(r => r.id === bus.id.split('-')[0]);
        if (!route) return bus;
        const prog = progressRef.current[bus.id];
        if (!prog) return bus;

        prog.t += 0.005 + Math.random() * 0.003;
        if (prog.t >= 1) {
          prog.stopIdx = (prog.stopIdx + 1) % route.stops.length;
          prog.t = 0;
        }

        const fromStop = route.stops[prog.stopIdx];
        const toStop = route.stops[(prog.stopIdx + 1) % route.stops.length];
        const lat = lerp(fromStop.lat, toStop.lat, prog.t);
        const lng = lerp(fromStop.lng, toStop.lng, prog.t);
        const heading = calcHeading(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
        const eta = Math.max(1, Math.round((1 - prog.t) * 8));

        return { ...bus, lat, lng, heading, eta, nextStop: toStop.name };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return buses;
}

export { ROUTES };
