import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Zap, Send, ArrowRight } from 'lucide-react';

const disruptionTypes = ['flightDelayed', 'flightCancelled', 'trainDelayed', 'trainCancelled', 'cabUnavailable', 'hotelCancelled', 'activityCancelled', 'weatherDisruption', 'travelerChangedPlans'];

export default function Disruptions() {
  const { t, bookings, activeDisruption, triggerDisruption, disruptions, formatTime, recoveryApplied, recoveryPlans } = useStore();
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
    const target = bookings.find((b) => b.type === 'flight');
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
  const flightTarget = bookings.find((b) => b.type === 'flight');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Disruptions & Recovery</h1>
          <p className="text-slate-500 text-sm">Real-time journey disruption monitoring and active resilience control.</p>
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-xl font-semibold text-xs transition-colors flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" /> Report / Simulate Disruption
        </button>
      </div>

      {/* Active Disruption */}
      {hasDisruption ? (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          {/* Banner */}
          <div className="bg-red-600 text-white p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <span className="font-bold text-sm">1 Active Disruption Impacting Connection Chain</span>
            </div>
            <span className="text-xs bg-red-700 px-2.5 py-1 rounded font-mono">STATUS: ACTION REQUIRED</span>
          </div>

          {/* Disruption Card */}
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-red-50/60 p-6 border-b border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">✈️</span>
                <div>
                  <h2 className="text-lg font-bold text-red-900">Flight AI-204 Delay Detected</h2>
                  <p className="text-xs text-red-700">Mumbai → Delhi · Scheduled Departure 10:30 AM</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-red-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Original Arrival</p>
                  <p className="font-bold text-slate-800 text-sm">13:15 (1:15 PM)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-red-500">Updated Arrival</p>
                  <p className="font-bold text-red-700 text-sm">{formatTime(flightTarget?.endTime || '16:15')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Delay</p>
                  <p className="font-bold text-slate-800 text-sm">+{activeDisruption.delayHours} Hours</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Root Cause</p>
                  <p className="font-bold text-slate-800 text-sm">Air Traffic Congestion</p>
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="p-6">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Downstream Impact Chain:</h3>
              <div className="space-y-2.5">
                {bookings
                  .filter((b) => b.status !== 'confirmed' && b.type !== 'flight')
                  .map((b) => (
                    <div
                      key={b.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        b.status === 'missed' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <span className="text-lg">{b.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-xs text-slate-900">{b.name}</p>
                        <p className="text-[11px] text-slate-500">{b.riskReason || b.status}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'missed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {b.status === 'missed' ? '🔴 Connection Missed' : '🟠 High Risk'}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Raahi Recommendation Card Inline */}
              <div className="mt-6 p-4 bg-[#f8f4ea] border border-[#e4ddd0] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a7a3a]">Raahi Recommendation</span>
                  <span className="text-xs font-bold text-slate-800">Plan C (Optimal)</span>
                </div>
                <p className="text-xs text-slate-700 mb-3">
                  Switch to alternative flight AI-315 and adjust cab transfer to 17:00. Keeps hotel, concert, and train unchanged with minimal cost impact.
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/recovery"
                    className="flex-1 bg-[#162518] text-white text-center py-2.5 rounded-xl text-xs font-semibold hover:bg-[#233a26] transition-colors"
                  >
                    Review Options & Apply Recommendation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : recoveryApplied ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-3xl mb-3">✅</p>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Recovery Plan Successfully Applied</h2>
          <p className="text-xs text-slate-500 mb-4">Your journey has been re-synchronized and is under active monitoring.</p>
          <Link to="/recovery-monitor" className="text-xs font-bold text-[#2d5230] hover:underline">
            Open Recovery Monitor →
          </Link>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-3xl mb-3">🛡️</p>
          <p className="text-sm font-semibold text-slate-800 mb-1">No Active Disruptions Detected</p>
          <p className="text-xs text-slate-500 mb-4">Your complete itinerary is on schedule and buffer thresholds are healthy.</p>
          <button onClick={() => setShowReport(true)} className="text-xs font-bold text-[#2d5230] hover:underline">
            Simulate a disruption scenario →
          </button>
        </div>
      )}

      {/* Report Disruption Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReport(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4">Report Disruption Scenario</h2>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {disruptionTypes.slice(0, 6).map((dt) => (
                  <button
                    key={dt}
                    onClick={() => {
                      setSelectedType(dt);
                      if (dt === 'flightDelayed') handleTrigger(3);
                    }}
                    className={`p-3 rounded-xl border text-xs text-left hover:border-red-300 hover:bg-red-50 transition-colors ${
                      selectedType === dt ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    }`}
                  >
                    {t(dt)}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-slate-700 mb-1.5 block">Or input natural language prompt:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nlInput}
                    onChange={(e) => setNlInput(e.target.value)}
                    placeholder="e.g. Flight AI-204 delayed by 3 hours"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-300"
                  />
                  <button onClick={handleNLParse} className="bg-red-600 text-white p-2.5 rounded-xl hover:bg-red-500">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {extraction && (
                <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs">
                  <p className="font-bold text-slate-800 mb-1">Parsed Disruption Parameters:</p>
                  <p>Transport: {extraction.transport} · Route: {extraction.route} · Delay: {extraction.delay}h</p>
                  <button
                    onClick={() => handleTrigger(extraction.delay)}
                    className="mt-2 w-full bg-red-600 text-white py-1.5 rounded-lg font-semibold"
                  >
                    Trigger Disruption Engine
                  </button>
                </div>
              )}

              <button onClick={() => setShowReport(false)} className="w-full text-slate-500 py-1.5 text-xs hover:underline">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
