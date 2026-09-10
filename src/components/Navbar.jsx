import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Menu, Globe, AlertTriangle } from 'lucide-react';

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

  const productLinks = [
    { label: 'My Trip', path: '/my-trip' },
    { label: 'Plan', path: '/add' },
    { label: 'Monitor', path: '/risk' },
    { label: 'Alerts', path: '/disruptions' },
    { label: 'Explore', path: '/assistant' },
  ];

  return (
    <header className="product-navbar">
      <div className="product-navbar__inner">
        <div className="product-navbar__left">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden icon-button"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="product-navbar__brand"><img src="/raahi-logo.svg" alt="Raahi" className="brand-logo" /><span>RAAHI</span></Link>
          <span className="product-navbar__rule" />
          <span className="product-navbar__page">{currentTitle}</span>
          <nav className="product-navbar__links" aria-label="Product navigation">
            {productLinks.map(link => <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'is-active' : ''}>{link.label}</Link>)}
          </nav>
        </div>

        <div className="product-navbar__actions">
          {activeDisruption && !recoveryApplied ? (
            <Link to="/disruptions" className="protection-status protection-status--alert">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>1 disruption active</span>
            </Link>
          ) : (
            <div className="protection-status">
              <span className="status-dot" />
              <span>Protected</span>
            </div>
          )}
          <button onClick={toggleLanguage} className="language-button" title="Switch Language / भाषा बदलें">
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'EN' : 'हिं'}</span>
          </button>
          <Link to="/profile" className="profile-link"><span className="profile-avatar">S</span><span className="hidden md:block">{profile.name || 'Shruti Sharma'}</span></Link>
        </div>
      </div>
    </header>
  );
}
