import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('passenger');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') navigate('/admin');
      else if (profile.role === 'driver') navigate('/driver');
      else navigate('/dashboard');
    }
  }, [user, profile, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Full name is required'); setLoading(false); return; }
      const { error: err } = await signUp(email, password, fullName, role);
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) { setError('Invalid email or password'); setLoading(false); return; }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-green-400/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Busly</span>
            </Link>
            <h1 className="text-2xl font-black text-white mb-1">
              {mode === 'signin' ? 'Welcome back!' : 'Create account'}
            </h1>
            <p className="text-green-100 text-sm">
              {mode === 'signin' ? 'Sign in to track your buses' : 'Start tracking buses for free'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m as 'signin' | 'signup'); setError(''); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  mode === m ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-5"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pb-1">
                      <Field label="Full Name" type="text" value={fullName} onChange={setFullName} placeholder="John Doe" required />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[['passenger', 'Passenger'], ['driver', 'Driver']].map(([v, l]) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setRole(v)}
                              className={`py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                                role === v ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition-all shadow-lg shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Try demo accounts</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Passenger', email: 'passenger@busly.app', pass: 'demo123' },
                  { label: 'Driver', email: 'driver@busly.app', pass: 'demo123' },
                  { label: 'Admin', email: 'admin@busly.app', pass: 'demo123' },
                ].map(d => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => { setMode('signin'); setEmail(d.email); setPassword(d.pass); }}
                    className="py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 transition-colors"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          By continuing, you agree to Busly's{' '}
          <a href="#" className="text-green-400 hover:underline">Terms</a> and{' '}
          <a href="#" className="text-green-400 hover:underline">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
      />
    </div>
  );
}
