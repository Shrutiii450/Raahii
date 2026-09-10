import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, ChevronRight, CircleAlert, Clock3, MapPin, ShieldCheck,
  Sparkles, TrainFront, WalletCards, RefreshCcw, ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { monitoringService } from '../services/monitoringService';
import heroImage from '../assets/hero.png';

const travelImages = {
  hero: heroImage,
  mountain: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=85',
  road: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=720&q=85',
};

const typeIcons = { flight: '✈️', cab: '🚕', hotel: '🏨', activity: '🎫', train: '🚆' };

// ── 1. LIVE JOURNEY PANEL ──────────────────────────────────────────────────
function LiveJourneyPanel({ bookings, tripHealth, activeDisruption }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'ljp-status-confirmed';
      case 'delayed': return 'ljp-status-delayed';
      case 'atRisk': return 'ljp-status-atRisk';
      case 'missed': return 'ljp-status-missed';
      default: return 'ljp-status-default';
    }
  };

  return (
    <div className="live-journey-panel">
      <div className="ljp-header">
        <div>
          <p className="ljp-eyebrow">Current Journey</p>
          <h3 className="ljp-route">Mumbai → Delhi → Jaipur</h3>
          <p className="ljp-dates">12 Oct — 16 Oct 2025</p>
        </div>
        <div className="ljp-status-dots">
          <span className="ljp-dot ljp-dot--green">● Protected</span>
          <span className="ljp-dot ljp-dot--pulse">● Live Monitoring</span>
        </div>
      </div>

      <div className="ljp-health">
        <div>
          <span className="ljp-eyebrow">Trip Health</span>
          <div className="ljp-health-left">
            <span className="ljp-score">{tripHealth}</span>
            <span className="ljp-score-denom">/100</span>
          </div>
        </div>
        <span className="ljp-health-label" style={{ color: tripHealth >= 80 ? '#2d5230' : '#a24d3b' }}>
          {tripHealth >= 80 ? 'Excellent' : tripHealth >= 60 ? 'Moderate Risk' : 'High Risk'}
        </span>
      </div>

      <div className="ljp-timeline">
        {bookings.map((b, idx) => {
          const isExpanded = expandedId === b.id;
          return (
            <div key={b.id}>
              <div
                className={`ljp-item ${isExpanded ? 'ljp-item--expanded' : ''}`}
                onClick={() => toggleExpand(b.id)}
              >
                <span className="ljp-item-icon">{b.emoji || typeIcons[b.type] || '•'}</span>
                <div className="ljp-item-body">
                  <span className="ljp-item-name">{b.name}</span>
                  <span className="ljp-item-meta">{b.startTime} · {b.from}</span>
                </div>
                <div className="ljp-item-right">
                  <span className={`ljp-status-badge ${getStatusBadgeClass(b.status)}`}>
                    {b.status === 'confirmed' ? 'Confirmed' : b.status === 'atRisk' ? 'Monitoring' : b.status}
                  </span>
                  {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="ljp-item-detail">
                      <div className="ljp-detail-grid">
                        <div><span>Reference</span><strong>{b.bookingRef || 'N/A'}</strong></div>
                        <div><span>Est. Cost</span><strong>₹{b.cost?.toLocaleString() || '0'}</strong></div>
                        <div><span>Policy</span><strong>{b.cancellationPolicy || 'Standard'}</strong></div>
                        <div><span>Refund</span><strong>{b.refund || 'Standard'}</strong></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {idx < bookings.length - 1 && <div className="ljp-connector bg-slate-200" />}
            </div>
          );
        })}
      </div>

      <Link to="/my-trip" className="ljp-full-link">
        View Complete Itinerary Details →
      </Link>
    </div>
  );
}

// ── 2. LIVE MONITORING DASHBOARD BAR ──────────────────────────────────────
function MonitoringBar() {
  const [secondsAgo, setSecondsAgo] = useState(14);
  const [status, setStatus] = useState('idle'); // 'idle' | 'checking' | 'updated'

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setStatus('checking');
    await monitoringService.refresh();
    setStatus('updated');
    setSecondsAgo(0);
    setTimeout(() => {
      setStatus('idle');
    }, 3000);
  };

  return (
    <section className="monitoring-panel">
      <div className="monitoring-panel__inner">
        <div className="monitoring-panel__left">
          <div className="monitoring-badge">
            <span className="monitoring-pulse" />
            <span>RAAHI IS WATCHING</span>
          </div>

          <div className="monitoring-categories">
            <div className="mon-cat"><span>✈ Transport</span><b>3 bookings</b></div>
            <div className="mon-cat mon-cat--simulated">
              <span>☁ Weather</span><b>2 destinations</b>
              <span className="sim-badge">SIMULATED</span>
            </div>
            <div className="mon-cat"><span>🏨 Lodging</span><b>2 bookings</b></div>
            <div className="mon-cat"><span>📍 Activities</span><b>4 planned</b></div>
          </div>
        </div>

        <div className="monitoring-panel__right">
          <span className={`monitoring-status-text ${status === 'checking' ? 'mon-status-checking' : status === 'updated' ? 'mon-status-updated' : ''}`}>
            {status === 'checking' ? 'CHECKING JOURNEY...' : status === 'updated' ? 'JOURNEY UPDATED · Just now' : `Last checked: ${secondsAgo}s ago`}
          </span>

          <button
            onClick={handleRefresh}
            disabled={status === 'checking'}
            className="refresh-btn"
          >
            <RefreshCcw size={12} className={status === 'checking' ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// ── 3. ROUTE MAP COMPONENT ──────────────────────────────────────────────────
function RouteMap() {
  const stops = [
    { city: 'Mumbai', status: 'Completed', detail: 'Departed 12 Oct', type: 'completed' },
    { city: 'Delhi', status: 'Current / Monitoring', detail: 'Arrived 13 Oct · Active', type: 'current' },
    { city: 'Jaipur', status: 'Upcoming', detail: 'Scheduled 16 Oct', type: 'upcoming' },
  ];

  return (
    <div className="route-map">
      <p className="eyebrow">Journey Corridor</p>
      <h3 className="font-heading text-xl text-slate-900 font-medium">Route Visualization</h3>
      <div className="route-map__stops">
        {stops.map((stop, index) => (
          <div key={stop.city} className="route-stop">
            <div className="route-stop__visual">
              <span className={`route-dot route-dot--${stop.type}`} />
              {index < stops.length - 1 && (
                <div className={`route-line route-line--${stop.type}`} />
              )}
            </div>
            <div className="route-stop__info">
              <strong>{stop.city}</strong>
              <span className="route-date">{stop.detail}</span>
              <span className={`route-state route-state--${stop.type}`}>{stop.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. JOURNEY HEALTH ASSESSMENT COMPONENT ────────────────────────────────
function JourneyHealthAssessment({ tripHealth, getRiskConnections }) {
  const connections = getRiskConnections();
  const highOrMed = connections.find((c) => c.risk !== 'low');

  return (
    <div className="journey-health">
      <div className="journey-health__score">
        <p className="eyebrow">Health Index</p>
        <div className="jh-number">
          <span style={{ color: tripHealth >= 80 ? '#2d5230' : '#a24d3b' }}>{tripHealth}</span>
          <span className="jh-denom">/100</span>
        </div>
        <span className="jh-label">{tripHealth >= 80 ? 'Excellent Assessment' : 'Attention Required'}</span>
        <p className="jh-note">Current assessment (simulated & live data blend)</p>
      </div>

      <div className="journey-health__grid">
        <div className="jh-category jh-category--good">
          <span className="jh-cat-name">Transport</span>
          <div className="jh-cat-status">
            <span className="jh-dot jh-dot--good" />
            <span>Stable</span>
          </div>
        </div>

        <div className="jh-category jh-category--warn">
          <span className="jh-cat-name">
            Weather <span className="sim-badge" style={{ fontSize: '6px' }}>SIM</span>
          </span>
          <div className="jh-cat-status">
            <span className="jh-dot jh-dot--warn" />
            <span>Watch</span>
          </div>
        </div>

        <div className={`jh-category ${highOrMed ? 'jh-category--warn' : 'jh-category--good'}`}>
          <span className="jh-cat-name">Connections</span>
          <div className="jh-cat-status">
            <span className={`jh-dot ${highOrMed ? 'jh-dot--warn' : 'jh-dot--good'}`} />
            <span>{highOrMed ? 'Tight Buffer' : 'Stable'}</span>
          </div>
        </div>

        <div className="jh-category jh-category--good">
          <span className="jh-cat-name">Accommodation</span>
          <div className="jh-cat-status">
            <span className="jh-dot jh-dot--good" />
            <span>Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 5. LIVE ACTIVITY FEED COMPONENT ───────────────────────────────────────
function ActivityFeed({ bookings }) {
  const [activities] = useState(() => monitoringService.getInitialActivityFeed(bookings));

  return (
    <section className="activity-feed-section">
      <div className="max-w-[1120px] mx-auto">
        <p className="eyebrow">Real-Time Operational Audit</p>
        <h3>Live Journey Activity Feed</h3>

        <div className="activity-feed__list">
          {activities.map((act) => (
            <div key={act.id} className="activity-item">
              <span className="activity-time">{act.time}</span>
              <span className={`activity-indicator activity-indicator--${act.status}`} />
              <div className="activity-body">
                <span className="activity-text">{act.text}</span>
                <span className="activity-detail">{act.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── MAIN HOME PAGE ────────────────────────────────────────────────────────
export default function Home() {
  const { t, bookings, tripHealth, activeDisruption, recoveryApplied, getRiskConnections } = useStore();

  return (
    <div className="product-home">
      {/* Live Monitoring Dashboard Bar */}
      <MonitoringBar />

      {/* Editorial Hero */}
      <section className="home-editorial-hero">
        <div className="home-hero-grid">
          {/* Left: Copy */}
          <div className="home-hero-copy">
            <p className="eyebrow">INTELLIGENT TRAVEL RESILIENCE</p>
            <h1>
              TRAVEL PLANS CHANGE.<br />
              <em>Raahi adapts.</em>
            </h1>
            <p className="hero-description">
              Raahi understands your complete itinerary, detects disruptions before they affect your journey,
              and helps you recover with intelligent alternatives.
            </p>
            <div className="hero-actions">
              <Link to="/add" className="button button--primary">
                Build my itinerary <ArrowRight size={16} />
              </Link>
              <Link to="/my-trip" className="text-link">
                View my trip <ChevronRight size={16} />
              </Link>
            </div>
            <div className="hero-places">
              <span className="place-thumb" style={{ backgroundImage: `url(${travelImages.mountain})` }} />
              <span>
                <small>Monitored Journey Corridor</small>
                <strong>Mumbai → Delhi → Jaipur</strong>
                <i className="not-italic text-slate-500 font-sans text-xs font-semibold mt-0.5 block">
                  {bookings.length} bookings monitored in real-time
                </i>
              </span>
            </div>
          </div>

          {/* Right: Live Journey Panel */}
          <motion.div
            className="home-hero-product"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <LiveJourneyPanel bookings={bookings} tripHealth={tripHealth} activeDisruption={activeDisruption} />
          </motion.div>
        </div>
      </section>

      {/* Route & Health Section */}
      <section className="route-health-section">
        <div className="max-w-[1120px] mx-auto route-health-grid">
          <RouteMap />
          <JourneyHealthAssessment tripHealth={tripHealth} getRiskConnections={getRiskConnections} />
        </div>
      </section>

      {/* Stats Row */}
      <section className="home-stats-row">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">
              {tripHealth}<small>%</small>
            </span>
            <span className="stat-label">Trip Health Score</span>
            <span className="stat-sub">Protected & actively monitored</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{bookings.length}</span>
            <span className="stat-label">Live Bookings</span>
            <span className="stat-sub">All tracked in real-time</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              3<small>×</small>
            </span>
            <span className="stat-label">Recovery Options</span>
            <span className="stat-sub">Available for any disruption</span>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <ActivityFeed bookings={bookings} />

      {/* Itinerary Overview */}
      <section className="home-section home-section--intro">
        <div className="section-grid">
          <div>
            <p className="eyebrow">One intelligent view</p>
            <h2>
              Your entire journey.<br />
              <em>Nothing left to chance.</em>
            </h2>
          </div>
          <div className="section-copy">
            <p>
              From the first booking to the final activity, Raahi connects the moving pieces of your trip and gives you a clear view of what is happening now, what might change, and what to do next.
            </p>
            <Link to="/my-trip" className="text-link">
              Open itinerary <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="editorial-itinerary">
          {bookings.slice(0, 5).map((booking, index) => (
            <div className="editorial-itinerary__row" key={booking.id}>
              <span className="date-column">
                {index === 0 ? '12 OCT' : index === 1 ? '13 OCT' : `${14 + index} OCT`}
              </span>
              <span className="itinerary-line">
                <i />
              </span>
              <div className="itinerary-place">
                <strong>{booking.from}</strong>
                <small>{booking.name}</small>
              </div>
              <div className="itinerary-time">
                <Clock3 size={14} /> {booking.startTime}
              </div>
              <span className="itinerary-status">
                <Check size={13} /> {booking.status === 'confirmed' ? 'Confirmed' : t(booking.status)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Disruption Card Section */}
      <section className="home-section home-section--disruption">
        <div className="disruption-layout">
          <div>
            <p className="eyebrow eyebrow--muted">Detect · understand · adapt</p>
            <h2>
              When something shifts,<br />
              <em>you see the way forward.</em>
            </h2>
            <p className="section-copy-text">
              Raahi traces the impact across your itinerary, then gives you practical options with the trade-offs made clear.
            </p>
            <Link to={activeDisruption ? '/disruptions' : '/what-if'} className="button button--dark">
              {activeDisruption ? 'Review disruption' : 'Explore a what-if'} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="disruption-card">
            <div className="disruption-card__header">
              <span className="signal-icon">
                <CircleAlert size={17} />
              </span>
              <div>
                <p className="eyebrow">{activeDisruption ? 'Flight disruption detected' : 'Proactive protection'}</p>
                <strong>{activeDisruption ? 'A change is affecting your journey' : 'Your connections are being watched'}</strong>
              </div>
            </div>
            <div className="disruption-card__route">
              <span>Mumbai</span>
              <div className="disruption-dash">
                <i /><i /><i />
              </div>
              <span>Delhi</span>
            </div>
            <div className="disruption-impact">
              <small>IMPACT ANALYSIS</small>
              <p>{activeDisruption ? activeDisruption.description : 'Connection buffers, transport timing, and hotel check-in are continuously evaluated.'}</p>
            </div>
            <div className="recommendation-row">
              <span>
                <Sparkles size={15} /> Raahi recommendation
              </span>
              <strong>{recoveryApplied ? 'Recovery applied' : 'Alternative connection available'}</strong>
              <Link to="/recovery">
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
