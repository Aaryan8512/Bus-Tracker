import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Bus, MapPin, Bell, Clock, Shield, Zap, Star, ChevronRight,
  CheckCircle, Users, Route, Activity, ArrowRight, Smartphone,
  Navigation, Wifi, BarChart3
} from 'lucide-react';
import Footer from '../components/layout/Footer';

const FEATURES = [
  { icon: MapPin, title: 'Real-Time Tracking', desc: 'See your bus on the live map, updated every second with GPS precision.', color: 'bg-green-50 text-green-600' },
  { icon: Clock, title: 'Accurate ETA', desc: 'Smart ETA calculation using live traffic, speed, and historical data.', color: 'bg-blue-50 text-blue-600' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get notified when your bus is 2 stops away. Never miss it again.', color: 'bg-amber-50 text-amber-600' },
  { icon: Route, title: 'Route Planner', desc: 'Find the best route from source to destination with transfers.', color: 'bg-rose-50 text-rose-600' },
  { icon: Shield, title: 'Safe & Secure', desc: 'All your data is encrypted. We take privacy seriously.', color: 'bg-violet-50 text-violet-600' },
  { icon: BarChart3, title: 'Crowd Level', desc: 'Know how full the bus is before boarding. Plan accordingly.', color: 'bg-teal-50 text-teal-600' },
];

const STATS = [
  { value: '50K+', label: 'Daily Commuters', icon: Users },
  { value: '200+', label: 'Active Routes', icon: Route },
  { value: '98.5%', label: 'On-Time Accuracy', icon: Activity },
  { value: '<1s', label: 'Update Latency', icon: Zap },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Daily Commuter', text: "Busly changed how I commute. I save 20 minutes daily just by knowing exactly when my bus arrives.", rating: 5, avatar: 'SM' },
  { name: 'James K.', role: 'University Student', text: "The university shuttle tracker is incredible. The real-time map is so smooth — feels like Google Maps for buses.", rating: 5, avatar: 'JK' },
  { name: 'Lisa T.', role: 'Office Professional', text: "I can plan my morning down to the minute. The crowd level feature helps me pick the right bus.", rating: 5, avatar: 'LT' },
];

const FAQS = [
  { q: 'How accurate is the real-time tracking?', a: 'Our GPS updates every 5 seconds with sub-10 meter accuracy. ETA calculations factor in real traffic conditions.' },
  { q: 'Is Busly free to use?', a: 'Basic tracking is completely free. Premium features like unlimited alerts and route history are available on our Pro plan.' },
  { q: 'Which cities are supported?', a: 'We currently serve 15 major cities with more being added monthly. Check our routes page for full coverage.' },
  { q: 'Can I track buses offline?', a: 'The app works offline for cached routes and schedules. Live tracking requires an internet connection.' },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 overflow-hidden flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-green-400/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Animated route line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <motion.path
              d="M0,400 C200,300 400,500 600,400 C800,300 1000,500 1200,400 C1300,350 1380,380 1440,400"
              stroke="rgba(22,163,74,0.15)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm font-medium">Live tracking active in 15 cities</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
              >
                Track Your Bus{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  in Real Time
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-xl text-gray-300 leading-relaxed mb-8 max-w-lg"
              >
                Stop guessing. Busly gives you live GPS location, accurate ETAs, crowd levels, and smart alerts — all in one beautiful app.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Link
                  to="/auth?mode=signup"
                  className="flex items-center justify-center gap-2 px-7 py-4 bg-green-500 text-white text-base font-semibold rounded-2xl hover:bg-green-400 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-400/40 hover:-translate-y-0.5 transform"
                >
                  Start Tracking Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/track"
                  className="flex items-center justify-center gap-2 px-7 py-4 bg-white/10 text-white text-base font-semibold rounded-2xl hover:bg-white/20 backdrop-blur border border-white/20 transition-all"
                >
                  <Navigation className="w-5 h-5" /> View Live Map
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-6"
              >
                {['Free to use', 'No signup required for map', 'Updated every 5s'].map(item => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400 text-sm">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Animated Bus Card */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="relative"
            >
              {/* Mock app card */}
              <div className="relative bg-gray-800/60 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">TRACKING</p>
                    <p className="text-white font-bold text-lg">BL-101 Central Express</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-300 text-xs font-medium">LIVE</span>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="relative h-44 bg-gray-700/50 rounded-2xl overflow-hidden mb-5">
                  <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  {/* Route line */}
                  <svg className="absolute inset-0 w-full h-full">
                    <motion.line x1="10%" y1="80%" x2="90%" y2="20%" stroke="#16a34a" strokeWidth="2" strokeDasharray="5,3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </svg>
                  {/* Stops */}
                  {[[10, 80], [30, 65], [55, 45], [75, 32], [90, 20]].map(([x, y], i) => (
                    <div key={i} className="absolute w-2.5 h-2.5 bg-gray-600 border-2 border-green-400 rounded-full" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }} />
                  ))}
                  {/* Animated bus marker */}
                  <motion.div
                    className="absolute"
                    animate={{ left: ['10%', '35%', '60%', '82%'], top: ['78%', '62%', '43%', '27%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-lg shadow-lg shadow-green-500/50 flex items-center justify-center">
                      <Bus className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'ETA', value: '4 min', color: 'text-green-400' },
                    { label: 'Speed', value: '32 km/h', color: 'text-blue-400' },
                    { label: 'Crowd', value: '65%', color: 'text-amber-400' },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-700/50 rounded-xl p-3 text-center">
                      <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
                      <p className="text-gray-400 text-xs">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Next stop */}
                <div className="flex items-center justify-between bg-gray-700/30 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-xs">Next Stop</p>
                      <p className="text-white text-sm font-semibold">Market Square</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 max-w-52"
              >
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Bus is nearby!</p>
                  <p className="text-xs text-gray-500">BL-101 arrives in 2 min</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-green-100 text-sm">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">Features</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Everything you need to commute smarter</h2>
              <p className="text-gray-500 text-lg">Built for modern urban commuters who value their time.</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.08}>
                <div className="group p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">How it Works</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Three steps to never miss a bus</h2>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Smartphone, title: 'Sign Up Free', desc: 'Create your account in under 30 seconds. No credit card needed.' },
              { step: '02', icon: Route, title: 'Search Your Route', desc: 'Enter your source and destination. Busly finds all available buses.' },
              { step: '03', icon: Navigation, title: 'Track in Real Time', desc: 'Watch your bus on the live map and get alerts when it\'s close.' },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15}>
                <div className="relative">
                  {i < 2 && (
                    <div className="hidden lg:block absolute top-8 left-full w-8 border-t-2 border-dashed border-green-200 z-10" />
                  )}
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="flex items-center gap-4 mb-5">
                      <span className="text-5xl font-black text-gray-100">{item.step}</span>
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-900 font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Loved by daily commuters</h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {Array(t.rating).fill(0).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-5 text-sm">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">FAQ</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Frequently Asked Questions</h2>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                      <span className="text-green-600 text-xs font-bold">Q</span>
                    </span>
                    {faq.q}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed pl-7">{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-green-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-16 h-16 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bus className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Ready to transform your commute?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">Join 50,000+ commuters who never miss their bus. Get started for free today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup" className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-semibold rounded-2xl hover:bg-green-400 transition-all shadow-2xl shadow-green-500/20">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/track" className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 border border-white/20 transition-all">
                <Wifi className="w-5 h-5" /> View Live Buses
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
