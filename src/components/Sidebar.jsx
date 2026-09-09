import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Shield, X, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const navSections = [
  {
    title: 'Journey',
    items: [
      { path: '/', key: 'home', emoji: '🏠' },
      { path: '/my-trip', key: 'myTrip', emoji: '🧳' },
      { path: '/add', key: 'addItinerary', emoji: '➕' },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { path: '/assistant', key: 'travelAssistant', emoji: '💬' },
      { path: '/risk', key: 'riskMonitor', emoji: '🛡️' },
      { path: '/disruptions', key: 'disruptions', emoji: '🚨' },
      { path: '/dependencies', key: 'dependencies', emoji: '🔗' },
      { path: '/what-if', key: 'whatIf', emoji: '🔮' },
    ]
  },
  {
    title: 'Recovery',
    items: [
      { path: '/recovery', key: 'recoveryPlans', emoji: '🔄' },
      { path: '/recovery-monitor', key: 'recoveryMonitor', emoji: '📋' },
    ]
  }
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { t, tripHealth, activeDisruption, recoveryApplied, bookings } = useStore();
  const location = useLocation();

  const getHealthColor = (h) => h >= 80 ? 'text-green-500' : h >= 60 ? 'text-amber-500' : 'text-red-500';

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200/80 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 via-teal-500 to-[#2E86AB] rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-[#1B2A4A] tracking-tight block leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                RAAHI
              </span>
              <span className="text-[10px] font-bold text-teal-600 tracking-wider uppercase">
                Resilience Engine
              </span>
            </div>
          </Link>

          {/* Close button for mobile/tablet */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map(item => {
                  const isActive = location.pathname === item.path;
                  const isDisruption = item.key === 'disruptions' && activeDisruption && !recoveryApplied;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/20'
                          : isDisruption
                          ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          : 'text-slate-600 hover:text-[#1B2A4A] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg leading-none">{item.emoji}</span>
                        <span>{t(item.key)}</span>
                      </div>

                      {isDisruption ? (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      ) : (
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                          isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'
                        }`} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Health & Trip Widget */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link to="/my-trip" onClick={() => setIsOpen(false)} className="block bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" /> {t('tripHealth')}
            </span>
            <span className={`text-sm font-extrabold ${getHealthColor(tripHealth)}`}>
              {tripHealth}/100
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tripHealth >= 80 ? 'bg-green-500' : tripHealth >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${tripHealth}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{bookings.length} Bookings Live</span>
            <span className="text-teal-600 font-semibold hover:underline">Details →</span>
          </p>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Laptop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
