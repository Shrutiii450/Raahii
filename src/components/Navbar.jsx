import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Shield, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', key: 'home', emoji: '🏠' },
  { path: '/my-trip', key: 'myTrip', emoji: '🧳' },
  { path: '/add', key: 'addItinerary', emoji: '➕' },
  { path: '/assistant', key: 'travelAssistant', emoji: '💬' },
  { path: '/risk', key: 'riskMonitor', emoji: '🛡️' },
  { path: '/disruptions', key: 'disruptions', emoji: '🚨' },
  { path: '/dependencies', key: 'dependencies', emoji: '🔗' },
  { path: '/what-if', key: 'whatIf', emoji: '🔮' },
  { path: '/recovery', key: 'recoveryPlans', emoji: '🔄' },
  { path: '/recovery-monitor', key: 'recoveryMonitor', emoji: '📋' },
  { path: '/profile', key: 'profile', emoji: '👤' },
];

export default function Navbar() {
  const { language, setLanguage, t, tripHealth, activeDisruption, recoveryApplied } = useStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed w-full z-50 border-b border-slate-100">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 mr-2 xl:mr-6 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-[#2E86AB] rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-[#1B2A4A] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RAAHI</span>
            </Link>

            {/* Desktop / Laptop Nav */}
            <div className="hidden xl:flex items-center gap-1 2xl:gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 py-1.5 2xl:px-3 2xl:py-2 rounded-lg text-xs 2xl:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                    location.pathname === item.path
                      ? 'text-teal-700 bg-teal-50 shadow-xs'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{t(item.key)}</span>
                </Link>
              ))}
            </div>

            {/* Medium Laptop Nav (13" / 14" screens) */}
            <div className="hidden lg:flex xl:hidden items-center gap-1">
              {navItems.slice(0, 8).map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                    location.pathname === item.path
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{t(item.key)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {/* Trip Health Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700">
              <div className={`w-2 h-2 rounded-full ${tripHealth >= 80 ? 'bg-green-500' : tripHealth >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
              <span>{tripHealth}/100</span>
            </div>

            {/* Active Alert */}
            {activeDisruption && !recoveryApplied && (
              <Link to="/disruptions" className="hidden md:flex items-center gap-1 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full animate-pulse text-xs font-bold text-red-700">
                <span>🚨</span> Alert
              </Link>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors text-slate-700"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'en' ? 'EN' : 'हिं'}</span>
            </button>

            {/* Profile */}
            <Link to="/profile" className="hidden md:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-400 to-[#2E86AB] rounded-full text-white text-xs font-bold shadow-sm hover:scale-105 transition-transform">
              S
            </Link>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Medium Tablet/Laptop Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-2 max-h-[75vh] overflow-y-auto">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    location.pathname === item.path
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
