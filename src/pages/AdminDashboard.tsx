import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bus, Users, Route, Activity, TrendingUp, MapPin, Clock, AlertCircle, CheckCircle, Settings, ChevronRight, BarChart3, Navigation, Zap, Eye, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase, Route as BusRoute, Bus as BusType } from '../lib/supabase';
import { useSimulatedTrips } from '../hooks/useSimulatedTrips';

const RIDERSHIP_DATA = [
  { time: '6am', count: 120 }, { time: '7am', count: 380 }, { time: '8am', count: 620 },
  { time: '9am', count: 490 }, { time: '10am', count: 290 }, { time: '11am', count: 310 },
  { time: '12pm', count: 450 }, { time: '1pm', count: 380 }, { time: '2pm', count: 280 },
  { time: '3pm', count: 420 }, { time: '4pm', count: 580 }, { time: '5pm', count: 710 },
  { time: '6pm', count: 640 }, { time: '7pm', count: 390 }, { time: '8pm', count: 240 },
];

const WEEKLY_DATA = [
  { day: 'Mon', trips: 42, passengers: 1840 },
  { day: 'Tue', trips: 38, passengers: 1620 },
  { day: 'Wed', trips: 51, passengers: 2200 },
  { day: 'Thu', trips: 47, passengers: 2010 },
  { day: 'Fri', trips: 55, passengers: 2450 },
  { day: 'Sat', trips: 35, passengers: 1580 },
  { day: 'Sun', trips: 28, passengers: 1200 },
];

const PIE_DATA = [
  { name: 'Active', value: 4, color: '#16a34a' },
  { name: 'Idle', value: 1, color: '#64748b' },
  { name: 'Maintenance', value: 1, color: '#f59e0b' },
];

const ALERTS = [
  { type: 'warning', message: 'BUS-006 overdue for maintenance inspection', time: '2m ago' },
  { type: 'info', message: 'BL-101 running 3 minutes behind schedule', time: '8m ago' },
  { type: 'success', message: 'BUS-002 completed route BL-202 successfully', time: '15m ago' },
  { type: 'warning', message: 'High passenger load on BL-303 University Shuttle', time: '22m ago' },
];

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; trend?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
    </motion.div>
  );
}

type AdminTab = 'overview' | 'buses' | 'routes' | 'drivers';

export default function AdminDashboard() {
  const buses = useSimulatedTrips();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [dbBuses, setDbBuses] = useState<BusType[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  useEffect(() => {
    supabase.from('routes').select('*').then(({ data }) => { if (data) setRoutes(data); });
    supabase.from('buses').select('*').then(({ data }) => { if (data) setDbBuses(data); });
  }, []);

  const activeBuses = buses.filter(b => b.status === 'active').length;
  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'drivers', label: 'Drivers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-500 text-sm mb-1">Good morning, Admin</p>
            <h1 className="text-3xl font-black text-gray-900">Operations Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-2 rounded-xl border border-green-100 font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {activeBuses} buses live
            </div>
            <Link to="/track" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-500 transition-colors">
              <Navigation className="w-4 h-4" /> Live Map
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users" value="52,847" sub="+2.4k this week" icon={Users} color="bg-blue-50 text-blue-600" trend="+12%" />
              <StatCard label="Active Buses" value={activeBuses} sub={`of ${dbBuses.length} total`} icon={Bus} color="bg-green-50 text-green-600" />
              <StatCard label="Active Routes" value={routes.filter(r => r.is_active).length} sub="All operational" icon={Route} color="bg-amber-50 text-amber-600" />
              <StatCard label="Daily Trips" value="284" sub="Avg 47 per route" icon={Activity} color="bg-rose-50 text-rose-600" trend="+8%" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Ridership chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Today's Ridership</h3>
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">Real-time</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={RIDERSHIP_DATA}>
                    <defs>
                      <linearGradient id="riderGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2.5} fill="url(#riderGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bus fleet status */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-5">Fleet Status</h3>
                <div className="flex items-center justify-center mb-5">
                  <PieChart width={160} height={160}>
                    <Pie data={PIE_DATA} cx={80} cy={80} innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <div className="space-y-2">
                  {PIE_DATA.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly chart + Alerts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-5">Weekly Performance</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={WEEKLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="passengers" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 3 }} name="Passengers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">System Alerts</h3>
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                    {ALERTS.filter(a => a.type === 'warning').length} warnings
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {ALERTS.map((alert, i) => {
                    const iconMap = { warning: AlertCircle, info: Activity, success: CheckCircle };
                    const colorMap = { warning: 'text-amber-500 bg-amber-50', info: 'text-blue-500 bg-blue-50', success: 'text-green-500 bg-green-50' };
                    const Icon = iconMap[alert.type as keyof typeof iconMap];
                    const colorClass = colorMap[alert.type as keyof typeof colorMap];
                    return (
                      <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                        <div className={`w-7 h-7 rounded-lg ${colorClass} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-snug">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buses Tab */}
        {activeTab === 'buses' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Bus Fleet ({dbBuses.length})</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-500 transition-colors">
                <Plus className="w-4 h-4" /> Add Bus
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {['Bus ID', 'Model', 'Status', 'Route', 'Passengers', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dbBuses.map(bus => {
                    const liveBus = buses.find(b => b.busNumber === bus.registration_number);
                    const statusColor = {
                      active: 'bg-green-100 text-green-700',
                      idle: 'bg-gray-100 text-gray-600',
                      maintenance: 'bg-amber-100 text-amber-700',
                      offline: 'bg-red-100 text-red-700',
                    }[bus.status] || 'bg-gray-100 text-gray-600';

                    return (
                      <tr key={bus.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                              <Bus className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{bus.registration_number}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{bus.model}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor}`}>
                            {bus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{liveBus?.routeNumber || '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-24">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${((liveBus?.passengers || bus.current_passengers) / bus.capacity) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {liveBus?.passengers || bus.current_passengers}/{bus.capacity}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Routes ({routes.length})</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-500 transition-colors">
                <Plus className="w-4 h-4" /> Add Route
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {['Route', 'Name', 'From → To', 'Distance', 'Duration', 'Fare', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {routes.map(route => (
                    <tr key={route.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: route.color }}>
                          {route.route_number}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{route.name}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {route.source} → {route.destination}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{route.distance_km}km</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{route.avg_duration_mins}m</td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">${route.fare}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${route.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {route.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Driver Management</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-500 transition-colors">
                <Plus className="w-4 h-4" /> Add Driver
              </button>
            </div>
            <div className="p-6">
              {/* Demo drivers */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Marcus Johnson', bus: 'BUS-001', route: 'BL-101', trips: 312, rating: 4.9, status: 'on-duty' },
                  { name: 'Sarah Williams', bus: 'BUS-002', route: 'BL-202', trips: 248, rating: 4.8, status: 'on-duty' },
                  { name: 'David Chen', bus: 'BUS-003', route: 'BL-303', trips: 189, rating: 4.7, status: 'on-duty' },
                  { name: 'Emily Davis', bus: 'BUS-004', route: '—', trips: 156, rating: 4.9, status: 'off-duty' },
                  { name: 'Michael Brown', bus: 'BUS-005', route: 'BL-404', trips: 224, rating: 4.6, status: 'on-duty' },
                  { name: 'Jessica Lee', bus: '—', route: '—', trips: 98, rating: 5.0, status: 'leave' },
                ].map((driver, i) => (
                  <motion.div
                    key={driver.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-bold text-sm">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{driver.name}</p>
                          <p className="text-xs text-gray-500">{driver.bus}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        driver.status === 'on-duty' ? 'bg-green-100 text-green-700' :
                        driver.status === 'leave' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{driver.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{driver.trips}</p>
                        <p className="text-xs text-gray-500">Trips</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{driver.rating}</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{driver.route}</p>
                        <p className="text-xs text-gray-500">Route</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
