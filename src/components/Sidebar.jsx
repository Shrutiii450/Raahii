import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  X, ChevronRight, Activity,
  Home, Briefcase, Plus, MessageSquare,
  Shield, AlertTriangle, Link2, Lightbulb,
  RefreshCcw, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navSections = [
  {
    title: 'Journey',
    items: [
      { path: '/', key: 'home', Icon: Home },
      { path: '/my-trip', key: 'myTrip', Icon: Briefcase },
      { path: '/add', key: 'addItinerary', Icon: Plus },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { path: '/assistant', key: 'travelAssistant', Icon: MessageSquare },
      { path: '/risk', key: 'riskMonitor', Icon: Shield },
      { path: '/disruptions', key: 'disruptions', Icon: AlertTriangle },
      { path: '/dependencies', key: 'dependencies', Icon: Link2 },
      { path: '/what-if', key: 'whatIf', Icon: Lightbulb },
    ]
  },
  {
    title: 'Recovery',
    items: [
      { path: '/recovery', key: 'recoveryPlans', Icon: RefreshCcw },
      { path: '/recovery-monitor', key: 'recoveryMonitor', Icon: ClipboardList },
    ]
  }
];

export { navSections };

export default function Sidebar({ isOpen, setIsOpen }) {
  const { t, tripHealth, activeDisruption, recoveryApplied, bookings } = useStore();
  const location = useLocation();

  const getHealthColor = (h) => h >= 80 ? 'text-green-400' : h >= 60 ? 'text-amber-400' : 'text-red-400';

  const sidebarContent = (
    <div className="app-sidebar">
      <div>
        {/* Brand */}
        <div className="app-sidebar__brand">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src="/raahi-logo.svg" alt="Raahi" className="sidebar-logo" />
            <div>
              <span
                className="font-extrabold text-xl tracking-tight block leading-none"
                style={{ color: '#e8f0e8' }}
              >
                RAAHI
              </span>
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'rgba(180,210,180,.4)' }}
              >
                Travel Operations
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg"
            style={{ color: 'rgba(180,210,180,.45)', background: 'transparent' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div
          className="px-3 py-4 space-y-5 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {navSections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-1.5 sidebar-section-title">{section.title}</div>
              <div className="space-y-0.5">
                {section.items.map(({ path, key, Icon }) => {
                  const isActive = location.pathname === path;
                  const isAlert = key === 'disruptions' && activeDisruption && !recoveryApplied;
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                      style={{
                        background: isActive
                          ? 'rgba(255,255,255,.1)'
                          : isAlert ? 'rgba(220,50,50,.14)' : 'transparent',
                        color: isActive
                          ? '#f0ece0'
                          : isAlert ? '#fca5a5'
                          : 'rgba(184,208,176,.68)',
                        borderLeft: isActive
                          ? '2px solid rgba(240,236,224,.35)'
                          : '2px solid transparent',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} style={{ opacity: isActive ? 0.85 : 0.5 }} />
                        <span>{t(key)}</span>
                      </div>
                      {isAlert ? (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                        </span>
                      ) : isActive && (
                        <ChevronRight size={12} style={{ opacity: 0.35 }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Health Widget */}
      <div className="sidebar-health">
        <Link to="/my-trip" onClick={() => setIsOpen(false)} className="block">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[11px] font-bold flex items-center gap-1.5 tracking-wider uppercase"
              style={{ color: 'rgba(180,210,180,.45)' }}
            >
              <Activity size={12} style={{ color: 'rgba(140,200,140,.6)' }} />
              Trip Health
            </span>
            <span className={`text-sm font-extrabold ${getHealthColor(tripHealth)}`}>
              {tripHealth}/100
            </span>
          </div>
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,.08)' }}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                tripHealth >= 80 ? 'bg-green-500' : tripHealth >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${tripHealth}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span style={{ color: 'rgba(180,210,180,.32)', fontSize: '10px' }}>
              {bookings.length} bookings monitored
            </span>
            <span style={{ color: 'rgba(140,200,140,.6)', fontSize: '10px', fontWeight: 600 }}>
              View details
            </span>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
