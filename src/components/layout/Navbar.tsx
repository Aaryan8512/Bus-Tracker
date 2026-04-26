import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Bell, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const getDashboardPath = () => {
    if (profile?.role === 'admin') return '/admin';
    if (profile?.role === 'driver') return '/driver';
    return '/dashboard';
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-green-500 transition-colors">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled || !isLanding ? 'text-gray-900' : 'text-white'
            }`}>Busly</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <NavLink href="/#features" label="Features" scrolled={scrolled || !isLanding} />
                <NavLink href="/#routes" label="Routes" scrolled={scrolled || !isLanding} />
                <NavLink href="/about" label="About" scrolled={scrolled || !isLanding} />
              </>
            )}
            {user && (
              <>
                <Link to="/track" className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-green-600 ${scrolled || !isLanding ? 'text-gray-600' : 'text-white/80'}`}>
                  <Map className="w-4 h-4" /> Live Map
                </Link>
                <Link to={getDashboardPath()} className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-green-600 ${scrolled || !isLanding ? 'text-gray-600' : 'text-white/80'}`}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button className={`relative p-2 rounded-lg transition-colors hover:bg-green-50 ${scrolled || !isLanding ? 'text-gray-600' : 'text-white'}`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">
                        {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{profile?.full_name?.split(' ')[0] || 'User'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
                          <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="w-4 h-4" /> Profile Settings
                        </Link>
                        <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${scrolled || !isLanding ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>
                  Sign In
                </Link>
                <Link to="/auth?mode=signup" className="text-sm font-semibold px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors shadow-md shadow-green-200">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || !isLanding ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {user ? (
                <>
                  <MobileLink href="/track" label="Live Map" onClick={() => setMobileOpen(false)} />
                  <MobileLink href={getDashboardPath()} label="Dashboard" onClick={() => setMobileOpen(false)} />
                  <MobileLink href="/profile" label="Profile" onClick={() => setMobileOpen(false)} />
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileLink href="/#features" label="Features" onClick={() => setMobileOpen(false)} />
                  <MobileLink href="/about" label="About" onClick={() => setMobileOpen(false)} />
                  <MobileLink href="/auth" label="Sign In" onClick={() => setMobileOpen(false)} />
                  <Link to="/auth?mode=signup" onClick={() => setMobileOpen(false)} className="block w-full text-center px-3 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, label, scrolled }: { href: string; label: string; scrolled: boolean }) {
  return (
    <a href={href} className={`text-sm font-medium transition-colors hover:text-green-600 ${scrolled ? 'text-gray-600' : 'text-white/80'}`}>
      {label}
    </a>
  );
}

function MobileLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link to={href} onClick={onClick} className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
      {label}
    </Link>
  );
}
