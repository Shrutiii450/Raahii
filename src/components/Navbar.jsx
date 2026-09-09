import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Shield, Menu, X, User, Globe } from 'lucide-react';
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
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 mr-6">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-[#2E86AB] rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-[#1B2A4A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RAAHI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.slice(0, 10).map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    location.pathname === item.path
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-1">{item.emoji}</span>
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Trip Health Mini */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
              <div className={`w-2 h-2 rounded-full ${tripHealth >= 80 ? 'bg-green-500' : tripHealth >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
              <span className="text-xs font-semibold text-slate-600">{tripHealth}</span>
            </div>

            {/* Active Alert */}
            {activeDisruption && !recoveryApplied && (
              <Link to="/disruptions" className="hidden md:flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full animate-pulse">
                <span className="text-xs">🚨</span>
                <span className="text-xs font-semibold text-red-700">Alert</span>
              </Link>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-700">{language === 'en' ? 'EN' : 'हिं'}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Profile */}
            <Link to="/profile" className="hidden md:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-400 to-[#2E86AB] rounded-full text-white text-xs font-bold">
              S
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
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
