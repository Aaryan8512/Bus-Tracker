import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bus, Clock, Users, Zap, Search, X, ChevronRight, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSimulatedTrips, SimulatedBus } from '../hooks/useSimulatedTrips';

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createBusIcon(color: string, isSelected: boolean) {
  return L.divIcon({
    html: `
      <div style="
        width:${isSelected ? 40 : 32}px;
        height:${isSelected ? 40 : 32}px;
        background:${color};
        border-radius:8px;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 4px 12px ${color}60;
        border:2px solid white;
        transition:all 0.3s;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect width="16" height="16" x="4" y="3" rx="2"/>
          <path d="M4 11h16"/>
          <path d="M8 3v8"/>
          <path d="M16 3v8"/>
          <path d="M8 19v2"/>
          <path d="M16 19v2"/>
          <circle cx="9" cy="17" r="1"/>
          <circle cx="15" cy="17" r="1"/>
        </svg>
      </div>
      ${isSelected ? `<div style="position:absolute;top:-4px;right:-4px;width:12px;height:12px;background:#22c55e;border-radius:50%;border:2px solid white;animation:pulse 1s infinite"/>` : ''}
    `,
    className: '',
    iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
    iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
  });
}

function createStopIcon() {
  return L.divIcon({
    html: `<div style="width:10px;height:10px;background:white;border:2.5px solid #16a34a;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"/>`,
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);
  return null;
}

const ROUTE_PATHS: Record<string, [number, number][]> = {
  'BL-101': [[40.7128, -74.006], [40.7142, -74.0064], [40.7168, -74.005], [40.6892, -74.0445], [40.6413, -73.7781]],
  'BL-202': [[40.7142, -74.0064], [40.7168, -74.005], [40.7282, -74.0776], [40.758, -73.9855]],
  'BL-303': [[40.7128, -74.006], [40.7142, -74.0064], [40.7168, -74.005], [40.7195, -74.0035]],
  'BL-404': [[40.7142, -74.0064], [40.7128, -74.006], [40.6892, -74.0445]],
};

const ROUTE_COLORS: Record<string, string> = {
  'BL-101': '#16a34a',
  'BL-202': '#0891b2',
  'BL-303': '#d97706',
  'BL-404': '#dc2626',
};

function getCrowdColor(pct: number) {
  if (pct < 50) return 'text-green-600 bg-green-50';
  if (pct < 75) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

export default function TrackingPage() {
  const buses = useSimulatedTrips();
  const [selectedBus, setSelectedBus] = useState<SimulatedBus | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [filter, setFilter] = useState('');
  const [filterRoute, setFilterRoute] = useState('All');

  const filteredBuses = buses.filter(b => {
    const matchSearch = b.busNumber.toLowerCase().includes(filter.toLowerCase()) ||
      b.routeName.toLowerCase().includes(filter.toLowerCase()) ||
      b.routeNumber.toLowerCase().includes(filter.toLowerCase());
    const matchRoute = filterRoute === 'All' || b.routeNumber === filterRoute;
    return matchSearch && matchRoute;
  });

  function selectBus(bus: SimulatedBus) {
    setSelectedBus(bus);
    setMapCenter([bus.lat, bus.lng]);
  }

  const routes = ['All', 'BL-101', 'BL-202', 'BL-303', 'BL-404'];

  return (
    <div className="h-screen flex flex-col bg-gray-50 pt-16">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm z-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search buses or routes..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {routes.map(r => (
            <button
              key={r}
              onClick={() => setFilterRoute(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterRoute === r ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-green-50 px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="font-medium text-green-700">{buses.filter(b => b.status === 'active').length} Live</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col overflow-hidden shadow-lg z-10">
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {filteredBuses.length} buses found
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredBuses.map(bus => {
                const crowd = Math.round((bus.passengers / bus.capacity) * 100);
                const isSelected = selectedBus?.id === bus.id;
                return (
                  <motion.div
                    key={bus.id}
                    layout
                    onClick={() => selectBus(bus)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-green-50/50 ${isSelected ? 'bg-green-50 border-l-2 border-l-green-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bus.color + '20' }}>
                        <Bus className="w-4 h-4" style={{ color: bus.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-gray-900 text-sm">{bus.routeNumber}</span>
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {bus.eta}m
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs truncate mb-1.5">{bus.routeName}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCrowdColor(crowd)}`}>
                            {crowd}% full
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Navigation className="w-3 h-3" /> {bus.speed.toFixed(0)} km/h
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-green-100"
                      >
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-green-500" />
                          <span>Next: <strong>{bus.nextStop}</strong></span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredBuses.length === 0 && (
              <div className="p-8 text-center">
                <Bus className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No buses found</p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[40.7128, -74.006]}
            zoom={12}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapController center={mapCenter} />

            {/* Route lines */}
            {(filterRoute === 'All' ? Object.keys(ROUTE_PATHS) : [filterRoute]).map(route => (
              <Polyline
                key={route}
                positions={ROUTE_PATHS[route] || []}
                color={ROUTE_COLORS[route]}
                weight={3}
                opacity={0.6}
                dashArray="8,4"
              />
            ))}

            {/* Bus markers */}
            {filteredBuses.map(bus => (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={createBusIcon(bus.color, selectedBus?.id === bus.id)}
                eventHandlers={{ click: () => selectBus(bus) }}
              >
                <Popup className="busly-popup">
                  <div className="p-2 min-w-[160px]">
                    <p className="font-bold text-gray-900 mb-1">{bus.routeNumber} — {bus.routeName}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> ETA: {bus.eta} min</p>
                      <p className="flex items-center gap-1"><Users className="w-3 h-3" /> {bus.passengers}/{bus.capacity} passengers</p>
                      <p className="flex items-center gap-1"><Zap className="w-3 h-3" /> {bus.speed.toFixed(0)} km/h</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Selected bus panel */}
          <AnimatePresence>
            {selectedBus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md mx-auto px-4 z-[1000]"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedBus.color + '20' }}>
                        <Bus className="w-5 h-5" style={{ color: selectedBus.color }} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedBus.routeNumber}</p>
                        <p className="text-xs text-gray-500">{selectedBus.routeName}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedBus(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 divide-x divide-gray-100">
                    {[
                      { label: 'ETA', value: `${selectedBus.eta}m`, icon: Clock, color: 'text-green-600' },
                      { label: 'Speed', value: `${selectedBus.speed.toFixed(0)}km/h`, icon: Zap, color: 'text-blue-600' },
                      { label: 'Crowd', value: `${Math.round((selectedBus.passengers / selectedBus.capacity) * 100)}%`, icon: Users, color: 'text-amber-600' },
                      { label: 'Next', value: selectedBus.nextStop.split(' ')[0], icon: MapPin, color: 'text-rose-600' },
                    ].map(item => (
                      <div key={item.label} className="px-3 py-3 text-center">
                        <item.icon className={`w-4 h-4 ${item.color} mx-auto mb-1`} />
                        <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                        <p className="text-xs text-gray-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
