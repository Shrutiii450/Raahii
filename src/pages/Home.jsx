import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowRight, Shield, Zap, Star, DollarSign, ChevronDown } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function ScrollSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const floatingCards = [
  { emoji: '✈️', label: 'Flight', delay: 0, x: '5%', y: '20%' },
  { emoji: '🚕', label: 'Transfer', delay: 0.5, x: '80%', y: '15%' },
  { emoji: '🏨', label: 'Hotel', delay: 1, x: '85%', y: '60%' },
  { emoji: '🎫', label: 'Activity', delay: 1.5, x: '10%', y: '65%' },
  { emoji: '🚆', label: 'Train', delay: 2, x: '75%', y: '85%' },
];

const timelineSteps = [
  { emoji: '✈️', name: 'Flight AI-204', sub: 'Mumbai → Delhi', time: '10:30 AM', status: 'confirmed' },
  { emoji: '🚕', name: 'Airport Transfer', sub: 'Delhi Airport → Hotel', time: '1:45 PM', status: 'confirmed' },
  { emoji: '🏨', name: 'Hotel Oberoi', sub: 'Delhi', time: '3:00 PM', status: 'confirmed' },
  { emoji: '🎫', name: 'Arijit Singh Concert', sub: 'JLN Stadium', time: '7:30 PM', status: 'confirmed' },
  { emoji: '🚆', name: 'Shatabdi Express', sub: 'Delhi → Jaipur', time: '8:00 AM', status: 'confirmed' },
];

export default function Home() {
  const { t, language } = useStore();
  const [disruptionShown, setDisruptionShown] = useState(false);
  const disruptRef = useRef(null);
  const disruptInView = useInView(disruptRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (disruptInView) {
      const timer = setTimeout(() => setDisruptionShown(true), 800);
      return () => clearTimeout(timer);
    }
  }, [disruptInView]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #1a3a5c 50%, #14404f 100%)' }}>
        {/* Floating Cards */}
        {floatingCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 1, y: [0, -15, 0] }}
            transition={{ opacity: { delay: card.delay, duration: 1 }, scale: { delay: card.delay, duration: 0.8 }, y: { repeat: Infinity, duration: 4 + i, ease: 'easeInOut' } }}
            className="absolute hidden md:block bg-white/90 rounded-2xl p-4 shadow-2xl backdrop-blur-sm"
            style={{ left: card.x, top: card.y }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{card.emoji}</span>
              <span className="text-sm font-semibold text-slate-800">{card.label}</span>
            </div>
          </motion.div>
        ))}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm mb-8">
              <Shield className="w-4 h-4 text-teal-400" /> Intelligent Travel Resilience Engine
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t('heroTitle')}
            </h1>

            {language === 'en' && (
              <p className="text-xl md:text-2xl text-teal-300/80 mb-6 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                आपकी यात्रा। हर कदम पर सुरक्षित।
              </p>
            )}

            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/my-trip"
                className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-400/40 hover:scale-[1.02] flex items-center justify-center gap-2">
                {t('viewMyTrip')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/add"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02]">
                {t('buildMyItinerary')}
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="mt-16 flex justify-center">
            <ChevronDown className="w-8 h-8 text-white/40 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Section 1: Connected Journey */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t('story1Title')}
            </h2>
            <p className="text-lg text-slate-500">{t('story1Sub')}</p>
          </ScrollSection>

          <div className="relative max-w-md mx-auto">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-teal-400 via-teal-300 to-teal-200"></div>
            {timelineSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative pl-20 mb-6 last:mb-0"
              >
                <div className="absolute left-[22px] top-4 w-5 h-5 bg-teal-500 rounded-full border-4 border-white shadow-md z-10"></div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.emoji}</span>
                      <div>
                        <p className="font-semibold text-slate-800">{step.name}</p>
                        <p className="text-sm text-slate-500">{step.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-600">{step.time}</p>
                      <span className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">🟢 {t('confirmed')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Something Changes */}
      <section ref={disruptRef} className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollSection>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t('story2Title')}
              </h2>
              <p className="text-lg text-slate-500 mb-6">{t('story2Sub')}</p>
              <div className="inline-flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                🚨 Flight Delay Alert
              </div>
            </ScrollSection>

            <ScrollSection>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-red-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✈️</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Flight AI-204</h3>
                      <p className="text-sm text-slate-500">Mumbai → Delhi</p>
                    </div>
                  </div>
                  <motion.span
                    initial={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                    animate={disruptionShown ? { backgroundColor: '#fef2f2', color: '#dc2626' } : {}}
                    transition={{ duration: 0.8 }}
                    className="px-4 py-1.5 rounded-full text-sm font-bold"
                  >
                    {disruptionShown ? '🔴 Delayed 3h' : '🟢 On Time'}
                  </motion.span>
                </div>

                <motion.div initial={{ opacity: 0, height: 0 }} animate={disruptionShown ? { opacity: 1, height: 'auto' } : {}} transition={{ delay: 0.5 }} className="space-y-3 overflow-hidden">
                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                    <span className="text-xl mr-3">🚕</span>
                    <div>
                      <p className="font-semibold text-sm text-red-800">Airport Cab — Missed</p>
                      <p className="text-xs text-red-600">Pickup was at 1:45 PM, flight now arrives 4:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-amber-50 rounded-lg">
                    <span className="text-xl mr-3">🏨</span>
                    <div>
                      <p className="font-semibold text-sm text-amber-800">Hotel — Late Check-in</p>
                      <p className="text-xs text-amber-600">Arrival delayed to ~6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-amber-50 rounded-lg">
                    <span className="text-xl mr-3">🎫</span>
                    <div>
                      <p className="font-semibold text-sm text-amber-800">Concert — At Risk</p>
                      <p className="text-xs text-amber-600">Reduced buffer, tight timing</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* Section 3: Ripple Effect */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollSection>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t('story3Title')}
            </h2>
            <p className="text-lg text-slate-500 mb-12">{t('story3Sub')}</p>
          </ScrollSection>

          <div className="relative max-w-sm mx-auto">
            {[
              { emoji: '✈️', name: 'Flight', status: 'delayed', color: 'red' },
              { emoji: '🚕', name: 'Transfer', status: 'missed', color: 'red' },
              { emoji: '🏨', name: 'Hotel', status: 'atRisk', color: 'amber' },
              { emoji: '🎫', name: 'Concert', status: 'atRisk', color: 'amber' },
              { emoji: '🚆', name: 'Train', status: 'atRisk', color: 'yellow' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3, duration: 0.5 }}
              >
                <div className={`flex items-center justify-between p-4 rounded-xl mb-2 border-2 ${
                  item.color === 'red' ? 'bg-red-50 border-red-200' :
                  item.color === 'amber' ? 'bg-amber-50 border-amber-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${
                    item.color === 'red' ? 'text-red-600' : item.color === 'amber' ? 'text-amber-600' : 'text-yellow-600'
                  }`}>
                    {item.status === 'delayed' ? '🔴 Delayed' : item.status === 'missed' ? '🔴 Missed' : '🟠 At Risk'}
                  </span>
                </div>
                {i < 4 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3 + 0.2 }}
                    className="w-0.5 h-6 mx-auto bg-red-300 origin-top"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Raahi Finds the Impact */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollSection>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t('story4Title')}
            </h2>
            <p className="text-lg text-slate-500 mb-16">{t('story4Sub')}</p>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: 4, label: t('bookingsAffected'), icon: '📋', color: 'red' },
              { value: 3, label: t('connectionsAtRisk'), icon: '🔗', color: 'amber' },
              { value: 2500, label: t('potentialCost'), icon: '💰', color: 'orange', prefix: '₹' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-4 block">{stat.icon}</span>
                <p className={`text-4xl font-extrabold mb-2 ${
                  stat.color === 'red' ? 'text-red-600' : stat.color === 'amber' ? 'text-amber-600' : 'text-orange-600'
                }`}>
                  <AnimatedCounter target={stat.value} prefix={stat.prefix || ''} />
                </p>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Recovery Options */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <ScrollSection>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t('story5Title')}
            </h2>
            <p className="text-lg text-slate-500 mb-16">{t('story5Sub')}</p>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <DollarSign className="w-6 h-6" />, title: t('cheapest'), cost: '₹1,200', changes: '2 bookings', badge: '💰', color: 'emerald' },
              { icon: <Zap className="w-6 h-6" />, title: t('fastest'), cost: '₹4,500', changes: '3 hours saved', badge: '⚡', color: 'blue' },
              { icon: <Star className="w-6 h-6" />, title: t('leastDisruption'), cost: '₹2,800', changes: '1 change', badge: '⭐', color: 'teal', recommended: true },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative bg-white p-8 rounded-2xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 ${
                  plan.recommended ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-100'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {t('recommended')}
                  </div>
                )}
                <span className="text-4xl mb-4 block">{plan.badge}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                <p className="text-3xl font-extrabold text-slate-800 mb-1">{plan.cost}</p>
                <p className="text-sm text-slate-500">{plan.changes}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Before / After */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <ScrollSection>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t('story6Title')}
            </h2>
            <p className="text-lg text-slate-500 mb-16">{t('story6Sub')}</p>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollSection>
              <div className="bg-white p-6 rounded-2xl border-2 border-red-200 shadow-sm">
                <h3 className="text-lg font-bold text-red-600 mb-6 flex items-center justify-center gap-2">🔴 {t('before')}</h3>
                {[
                  { emoji: '✈️', name: 'AI-204', time: '1:15 PM', status: '🔴 Delayed' },
                  { emoji: '🚕', name: 'Cab', time: '1:45 PM', status: '🔴 Missed' },
                  { emoji: '🏨', name: 'Hotel', time: '3:00 PM', status: '🟠 Late' },
                  { emoji: '🎫', name: 'Concert', time: '7:30 PM', status: '🟠 At Risk' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{item.emoji}</span>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{item.time}</p>
                      <p className="text-xs font-semibold text-red-500">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollSection>

            <ScrollSection>
              <div className="bg-white p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                <h3 className="text-lg font-bold text-green-600 mb-6 flex items-center justify-center gap-2">🟢 {t('after')}</h3>
                {[
                  { emoji: '✈️', name: 'AI-315', time: '4:00 PM', status: '🟢 Confirmed' },
                  { emoji: '🚕', name: 'Cab', time: '5:00 PM', status: '🟢 Rebooked' },
                  { emoji: '🏨', name: 'Hotel', time: '3:00 PM', status: '🟢 No Change' },
                  { emoji: '🎫', name: 'Concert', time: '7:30 PM', status: '🟢 Safe' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{item.emoji}</span>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{item.time}</p>
                      <p className="text-xs font-semibold text-green-600">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollSection>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-12">
            <Link to="/what-if" className="bg-[#1B2A4A] hover:bg-[#243654] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all inline-flex items-center gap-2 shadow-lg">
              {t('whatIfTitle')} — {language === 'hi' ? 'अभी सिमुलेट करें' : 'Try It Now'} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0f1d33 100%)' }}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-teal-400" />
          <span className="font-extrabold text-3xl text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RAAHI</span>
        </div>
        <p className="text-xl text-slate-300 mb-2 font-medium">{t('footerTagline')}</p>
        {language === 'en' && <p className="text-lg text-teal-400/70">{t('footerTaglineHi') || 'योजनाएँ बदल सकती हैं, आपकी यात्रा नहीं रुकनी चाहिए।'}</p>}
        <p className="text-sm text-slate-500 mt-8">© 2025 RAAHI — Intelligent Travel Resilience</p>
      </footer>
    </div>
  );
}
