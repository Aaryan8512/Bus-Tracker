import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus, MapPin, Navigation, Clock, Users, Zap, Play, Square,
  ChevronRight, CheckCircle, AlertCircle, Activity, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Stop {
  name: string;
  eta: number;
  status: 'passed' | 'current' | 'upcoming';
}

const DEMO_ROUTE_STOPS: Stop[] = [
  { name: 'Central Station', eta: 0, status: 'passed' },
  { name: 'City Hall', eta: 8, status: 'passed' },
  { name: 'Market Square', eta: 18, status: 'current' },
  { name: 'Harbor Point', eta: 32, status: 'upcoming' },
  { name: 'Airport Terminal', eta: 55, status: 'upcoming' },
];

export default function DriverDashboard() {
  const { profile } = useAuth();
  const [onDuty, setOnDuty] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(32);
  const [passengers, setPassengers] = useState(28);

  useEffect(() => {
    if (!onDuty) return;
    const interval = setInterval(() => {
      setElapsed(e => e + 1);
      setSpeed(s => Math.max(20, Math.min(60, s + (Math.random() - 0.5) * 4)));
      setPassengers(p => Math.max(0, Math.min(54, p + Math.floor((Math.random() - 0.4) * 3))));
    }, 3000);
    return () => clearInterval(interval);
  }, [onDuty]);

  const formatTime = (s: number) => `${Math.floor(s / 3600).toString().padStart(2, '0')}:${Math.floor((s % 3600) / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full" style={{ background: 'radial-gradient(circle at right, rgba(22,163,74,0.15), transparent)' }} />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Driver Console</p>
                <h1 className="text-3xl font-black mb-1">{profile?.full_name || 'Driver'}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    onDuty ? 'bg-green-500/20 border-green-500/40 text-green-300' : 'bg-gray-700 border-gray-600 text-gray-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${onDuty ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                    {onDuty ? 'On Duty' : 'Off Duty'}
                  </div>
                  <span className="text-gray-500 text-xs">BUS-003 · BL-303</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setOnDuty(!onDuty); if (onDuty) setElapsed(0); }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                    onDuty
                      ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
                      : 'bg-green-500 hover:bg-green-400 text-white shadow-green-500/20'
                  }`}
                >
                  {onDuty ? <><Square className="w-4 h-4" /> End Trip</> : <><Play className="w-4 h-4" /> Start Trip</>}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Live stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Trip Time', value: formatTime(elapsed), icon: Clock, color: 'text-blue-600 bg-blue-50', active: onDuty },
                { label: 'Speed', value: `${speed.toFixed(0)} km/h`, icon: Zap, color: 'text-amber-600 bg-amber-50', active: onDuty },
                { label: 'Passengers', value: passengers, icon: Users, color: 'text-green-600 bg-green-50', active: onDuty },
                { label: 'Rating', value: '4.9', icon: Star, color: 'text-rose-600 bg-rose-50', active: true },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3 ${!stat.active && onDuty === false ? 'opacity-40' : ''}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className={`text-xl font-black ${stat.active ? 'text-gray-900' : 'text-gray-400'}`}>{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Route timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Route: BL-303 University Shuttle</h3>
                <span className="text-xs text-gray-400">Stop 3 of 5</span>
              </div>
              <div className="p-6">
                <div className="relative">
                  {/* Line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />

                  {DEMO_ROUTE_STOPS.map((stop, i) => (
                    <motion.div
                      key={stop.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative flex items-start gap-5 mb-6 last:mb-0`}
                    >
                      {/* Status dot */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        stop.status === 'passed' ? 'bg-green-500 border-green-500' :
                        stop.status === 'current' ? 'bg-green-500 border-green-300 shadow-lg shadow-green-200 animate-pulse' :
                        'bg-white border-gray-300'
                      }`}>
                        {stop.status === 'passed' ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : stop.status === 'current' ? (
                          <Bus className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>

                      <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold text-sm ${
                            stop.status === 'passed' ? 'text-gray-400 line-through' :
                            stop.status === 'current' ? 'text-green-700' : 'text-gray-700'
                          }`}>{stop.name}</p>
                          {stop.status === 'current' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Current</span>
                          )}
                          {stop.status === 'upcoming' && (
                            <span className="text-xs text-gray-400">{stop.eta}m from start</span>
                          )}
                        </div>
                        {stop.status === 'current' && (
                          <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Approaching stop
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {onDuty && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">Traffic Alert</p>
                    <p className="text-amber-700 text-xs mt-0.5">Moderate congestion ahead on Harbor Blvd. Estimated 3-minute delay.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Trip info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-900">Trip Info</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Bus Number', value: 'BUS-003', icon: Bus },
                  { label: 'Route', value: 'BL-303 University Shuttle', icon: Navigation },
                  { label: 'Capacity', value: '54 seats', icon: Users },
                  { label: 'Next Stop', value: 'Harbor Point', icon: MapPin },
                  { label: 'ETA Next', value: '8 minutes', icon: Clock },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver stats */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Trips', value: '247' },
                  { label: 'Avg Rating', value: '4.9' },
                  { label: 'On-Time %', value: '96%' },
                  { label: 'Hours Today', value: '3.5h' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3">
                    <p className="text-xl font-black">{s.value}</p>
                    <p className="text-green-100 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Passenger manifest */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Occupancy</h3>
                <span className="text-sm text-gray-500">{passengers}/54</span>
              </div>
              <div className="p-5">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    animate={{ width: `${(passengers / 54) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {passengers < 27 ? 'Low occupancy — comfortable journey' :
                   passengers < 43 ? 'Moderate occupancy' :
                   'High occupancy — suggest next bus to passengers'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
