import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Menu, Globe, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { language, setLanguage, t, activeDisruption, recoveryApplied, profile } = useStore();
  const location = useLocation();

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  // Derive human-readable current page title
  const pageTitles = {
    '/': t('home'),
    '/my-trip': t('myTrip'),
    '/add': t('addItinerary'),
    '/assistant': t('travelAssistant'),
    '/risk': t('riskMonitor'),
    '/disruptions': t('disruptions'),
    '/dependencies': t('dependencies'),
    '/what-if': t('whatIf'),
    '/recovery': t('recoveryPlans'),
    '/recovery-monitor': t('recoveryMonitor'),
    '/profile': t('profile'),
  };

  const currentTitle = pageTitles[location.pathname] || 'RAAHI';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 fixed top-0 right-0 left-0 lg:left-64 xl:left-72 z-30 transition-all duration-300">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Current Page Title Pill */}
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {currentTitle}
            </h2>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
              <Sparkles className="w-3 h-3 text-teal-500" /> Active Protection
            </span>
          </div>
        </div>

        {/* Right Side: Key Global Actions (Alerts, Language, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Disruption Pill */}
          {activeDisruption && !recoveryApplied ? (
            <Link
              to="/disruptions"
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden xs:inline">1 Disruption Active</span>
              <span className="xs:hidden">Alert</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe Buffer</span>
            </div>
          )}

          {/* Language Switcher (EN | हिन्दी) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-2xs"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'en' ? 'EN' : 'हिं'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 font-normal">{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Profile Section */}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 via-teal-500 to-[#2E86AB] flex items-center justify-center text-white text-xs font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-teal-700 transition-colors">
                {profile.name || 'Shruti Sharma'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-none">
                {profile.travelStyle || 'Solo'} Traveler
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
