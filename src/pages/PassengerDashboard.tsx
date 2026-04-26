import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bus, MapPin, Clock, Star, Bell, ChevronRight, Navigation,
  Search, ArrowRight, Zap, Users, Heart, TrendingUp
} from 'lucide-react';
import { supabase, Route } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSimulatedTrips } from '../hooks/useSimulatedTrips';
import { formatDistanceToNow } from 'date-fns';

function RouteCard({ route, isFav, onToggleFav }: { route: Route; isFav: boolean; onToggleFav: () => void }) {
  const colorMap: Record<string, string> = {
    '#16a34a': 'bg-green-50 border-green-100',
    '#0891b2': 'bg-blue-50 border-blue-100',
    '#d97706': 'bg-amber-50 border-amber-100',
    '#dc2626': 'bg-red-50 border-red-100',
  };
  const bgClass = colorMap[route.color] || 'bg-gray-50 border-gray-100';

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
      className={`rounded-2xl border p-5 ${bgClass} cursor-pointer transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: route.color + '20' }}>
            <Bus className="w-4 h-4" style={{ color: route.color }} />
          </div>
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: route.color }}>
              {route.route_number}
            </span>
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); onToggleFav(); }} className="p-1">
          <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{route.name}</h3>
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <MapPin className="w-3 h-3" />{route.source}
        <ArrowRight className="w-3 h-3 mx-0.5" />
        {route.destination}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.avg_duration_mins}m</span>
          <span className="flex items-center gap-1"><Navigation className="w-3 h-3" />{route.distance_km}km</span>
        </div>
        <span className="text-sm font-bold text-gray-900">${route.fare}</span>
      </div>
    </motion.div>
  );
}

const RECENT_ACTIVITY = [
  { route: 'BL-101 Central Express', time: new Date(Date.now() - 3600000 * 2), action: 'Tracked' },
  { route: 'BL-303 University Shuttle', time: new Date(Date.now() - 3600000 * 5), action: 'Alerted' },
  { route: 'BL-202 City Loop', time: new Date(Date.now() - 86400000), action: 'Tracked' },
];

export default function PassengerDashboard() {
  const { profile } = useAuth();
  const buses = useSimulatedTrips();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [favRoutes, setFavRoutes] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    supabase.from('routes').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setRoutes(data);
    });
  }, []);

  const filtered = routes.filter(r =>
    search === '' ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.source.toLowerCase().includes(search.toLowerCase()) ||
    r.destination.toLowerCase().includes(search.toLowerCase()) ||
    r.route_number.toLowerCase().includes(search.toLowerCase())
  ).filter(r => activeTab === 'all' || favRoutes.has(r.id));

  function toggleFav(routeId: string) {
    setFavRoutes(prev => {
      const next = new Set(prev);
      if (next.has(routeId)) next.delete(routeId);
      else next.add(routeId);
      return next;
    });
  }

  const activeBuses = buses.filter(b => b.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full opacity-10" style={{ background: 'radial-gradient(circle at right, white, transparent)' }} />
            <div className="relative">
              <p className="text-green-100 text-sm mb-1">Good morning,</p>
              <h1 className="text-3xl font-black mb-3">{profile?.full_name?.split(' ')[0] || 'Traveler'} 👋</h1>
              <p className="text-green-100 mb-6">{activeBuses.length} buses are live right now in your city</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/track" className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg">
                  <Navigation className="w-4 h-4" /> Live Map
                </Link>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 backdrop-blur border border-white/30 transition-colors">
                  <Bell className="w-4 h-4" /> Set Alert
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Live Buses', value: activeBuses.length, icon: Bus, color: 'text-green-600 bg-green-50' },
            { label: 'Active Routes', value: routes.length, icon: Navigation, color: 'text-blue-600 bg-blue-50' },
            { label: 'Saved Routes', value: favRoutes.size, icon: Heart, color: 'text-rose-600 bg-rose-50' },
            { label: 'Avg Wait', value: '4m', icon: Clock, color: 'text-amber-600 bg-amber-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Routes section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">Bus Routes</h2>
                  <div className="flex gap-1">
                    {[['all', 'All Routes'], ['favorites', 'Saved']].map(([t, l]) => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t as 'all' | 'favorites')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search source, destination, route..."
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {filtered.map((route, i) => (
                  <motion.div key={route.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <RouteCard route={route} isFav={favRoutes.has(route.id)} onToggleFav={() => toggleFav(route.id)} />
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-2 py-12 text-center">
                    <Bus className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      {activeTab === 'favorites' ? 'No saved routes yet. Heart a route to save it.' : 'No routes match your search.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Live buses nearby */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Live Buses</h3>
                <Link to="/track" className="text-xs text-green-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  View map <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {activeBuses.slice(0, 5).map(bus => (
                  <div key={bus.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: bus.color + '20' }}>
                      <Bus className="w-4 h-4" style={{ color: bus.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{bus.routeNumber}</p>
                      <p className="text-xs text-gray-500 truncate">{bus.nextStop}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-600">{bus.eta}m</p>
                      <div className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-400">live</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.route}</p>
                      <p className="text-xs text-gray-400">{item.action} · {formatDistanceToNow(item.time, { addSuffix: true })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick tip */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900 text-sm mb-1">Pro Tip</p>
                  <p className="text-green-700 text-xs leading-relaxed">Enable push notifications to get alerts when your bus is 2 stops away. Never wait again!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
