import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Zap, Send } from 'lucide-react';

const disruptionTypes = ['flightDelayed', 'flightCancelled', 'trainDelayed', 'trainCancelled', 'cabUnavailable', 'hotelCancelled', 'activityCancelled', 'weatherDisruption', 'travelerChangedPlans'];

export default function Disruptions() {
  const { t, bookings, activeDisruption, triggerDisruption, disruptions, formatTime, recoveryApplied } = useStore();
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [nlInput, setNlInput] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [extraction, setExtraction] = useState(null);

  const handleNLParse = () => {
    if (!nlInput.trim()) return;
    const text = nlInput.toLowerCase();
    let transport = 'Flight', route = 'Mumbai → Delhi', delay = 3;
    if (text.includes('train')) { transport = 'Train'; route = 'Delhi → Jaipur'; }
    if (text.includes('cab') || text.includes('taxi')) transport = 'Cab';
    const hourMatch = text.match(/(\d+)\s*(hour|hr|ghante|घंटे)/);
    if (hourMatch) delay = parseInt(hourMatch[1]);
    setExtraction({ transport, route, delay, confidence: 98 });
  };

  const handleTrigger = (delayHours = 3) => {
    const target = bookings.find(b => b.type === 'flight');
    if (!target) return;
    triggerDisruption({
      targetId: target.id,
      delayHours,
      type: 'delay',
      description: `Flight ${target.name} delayed by ${delayHours} hours due to air traffic congestion`,
    });
    setShowReport(false);
    setExtraction(null);
  };

  const hasDisruption = activeDisruption && !recoveryApplied;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            🚨 {t('disruptions')}
          </h1>
          <p className="text-slate-500">{t('activeDisruptions')}</p>
        </div>
        <button onClick={() => setShowReport(true)}
          className="bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {t('reportDisruption')}
        </button>
      </div>

      {/* Active Disruption */}
      {hasDisruption ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Alert Banner */}
          <div className="bg-red-500 text-white p-4 rounded-xl mb-6 flex items-center gap-3 animate-pulse">
            <Zap className="w-6 h-6" />
            <span className="font-bold">🚨 1 {t('disruptionDetected')}</span>
          </div>

          {/* Disruption Card */}
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-lg overflow-hidden mb-8">
            <div className="bg-red-50 p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">✈️</span>
                <div>
                  <h2 className="text-xl font-bold text-red-800">🚨 {t('flightDelayed')}</h2>
                  <p className="text-red-600">{bookings.find(b=>b.type==='flight')?.name || 'Flight AI-204'} | Mumbai → Delhi</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-red-500">{t('originalArrival')}</p><p className="font-bold text-red-800">1:15 PM</p></div>
                <div><p className="text-xs text-red-500">{t('expectedArrival')}</p><p className="font-bold text-red-800">{formatTime(bookings.find(b=>b.type==='flight')?.endTime || '16:15')}</p></div>
                <div><p className="text-xs text-red-500">{t('delay')}</p><p className="font-bold text-red-800">{activeDisruption.delayHours} {t('hours')}</p></div>
                <div><p className="text-xs text-red-500">{t('reason')}</p><p className="font-bold text-red-800">Air Traffic</p></div>
              </div>
            </div>

            {/* Impact */}
            <div className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">{t('impact')}:</h3>
              <div className="space-y-3">
                {bookings.filter(b => b.status !== 'confirmed' && b.type !== 'flight').map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      b.status === 'missed' ? 'bg-red-50 border border-red-200' :
                      b.status === 'atRisk' ? 'bg-amber-50 border border-amber-200' :
                      'bg-yellow-50 border border-yellow-200'
                    }`}>
                    <span className="text-xl">{b.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-800">{b.name}</p>
                      <p className="text-xs text-slate-500">{b.riskReason || b.status}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      b.status === 'missed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status === 'missed' ? '🔴 Missed' : '🟠 At Risk'}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link to="/recovery" className="flex-1 bg-[#1B2A4A] text-white text-center py-3 rounded-xl font-medium hover:bg-[#243654] transition-colors">
                  {t('viewRecoveryPlans')}
                </Link>
                <Link to="/assistant" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-400 transition-colors">
                  💬 {t('askRaahiAI')}
                </Link>
              </div>
            </div>
          </div>

          {/* Ripple Visualization */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 text-center">Disruption Ripple</h3>
            <div className="max-w-sm mx-auto">
              {bookings.map((b, i) => (
                <div key={b.id}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.3 }}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 ${
                      b.status === 'delayed' || b.status === 'missed' ? 'border-red-300 bg-red-50' :
                      b.status === 'atRisk' ? 'border-amber-300 bg-amber-50' :
                      'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{b.emoji}</span>
                      <span className="text-sm font-semibold">{b.name}</span>
                    </div>
                    <span className={`text-xs font-bold ${
                      b.status === 'confirmed' ? 'text-green-600' :
                      b.status === 'delayed' ? 'text-red-600' :
                      b.status === 'missed' ? 'text-red-700' : 'text-amber-600'
                    }`}>
                      {b.status === 'confirmed' ? '🟢' : b.status === 'delayed' ? '🔴' : b.status === 'missed' ? '🔴' : '🟠'} {b.status}
                    </span>
                  </motion.div>
                  {i < bookings.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: i * 0.3 + 0.15 }}
                      className={`w-0.5 h-6 mx-auto origin-top ${
                        b.status !== 'confirmed' ? 'bg-red-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : recoveryApplied ? (
        <div className="text-center py-16 bg-green-50 rounded-2xl border-2 border-green-200">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-green-700 mb-2">{t('recoveryApplied')}</h2>
          <Link to="/recovery-monitor" className="text-teal-600 font-medium hover:underline">View Recovery Monitor →</Link>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-4">🎉</p>
          <p className="text-lg text-slate-600">{t('noDisruptions')}</p>
          <button onClick={() => setShowReport(true)} className="mt-4 text-teal-600 font-medium hover:underline">
            Simulate a disruption →
          </button>
        </div>
      )}

      {/* Report Disruption Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReport(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-slate-900 mb-6">🚨 {t('reportDisruption')}</h2>

              {/* Quick select */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {disruptionTypes.slice(0, 6).map(dt => (
                  <button key={dt} onClick={() => { setSelectedType(dt); if (dt === 'flightDelayed') handleTrigger(3); }}
                    className={`p-3 rounded-xl border text-sm text-left hover:border-red-300 hover:bg-red-50 transition-colors ${
                      selectedType === dt ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    }`}>
                    {t(dt)}
                  </button>
                ))}
              </div>

              {/* Natural Language */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Or describe in your own words:</label>
                <div className="flex gap-2">
                  <input type="text" value={nlInput} onChange={e => setNlInput(e.target.value)}
                    placeholder={t('describeDisruption')}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-300" />
                  <button onClick={handleNLParse} className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-400">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {extraction && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-bold text-slate-700 mb-2">AI Extraction:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Transport: <strong>{extraction.transport}</strong></div>
                    <div>Route: <strong>{extraction.route}</strong></div>
                    <div>Delay: <strong>{extraction.delay} hours</strong></div>
                    <div>Confidence: <strong>{extraction.confidence}%</strong></div>
                  </div>
                  <button onClick={() => handleTrigger(extraction.delay)}
                    className="mt-3 w-full bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-400">
                    {t('analyzeDisruption')}
                  </button>
                </motion.div>
              )}

              <button onClick={() => setShowReport(false)} className="w-full text-slate-500 py-2 text-sm hover:underline">
                {t('cancel')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
