import { Link } from 'react-router-dom';
import { Bus, Twitter, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Busly</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Smart real-time bus tracking for the modern commuter. Know where your bus is, always.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              {['Live Tracking', 'Route Search', 'Bus Alerts', 'Driver App', 'Admin Panel'].map(item => (
                <li key={item}><a href="#" className="text-sm hover:text-green-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[['About', '/about'], ['Contact', '/contact'], ['Privacy Policy', '#'], ['Terms of Service', '#'], ['Careers', '#']].map(([label, href]) => (
                <li key={label}><Link to={href} className="text-sm hover:text-green-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-green-500 shrink-0" /> 123 Transit Ave, San Francisco</li>
              <li className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-green-500 shrink-0" /> hello@busly.app</li>
              <li className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-green-500 shrink-0" /> +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Busly Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400">System operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
