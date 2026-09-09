import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, RotateCcw } from 'lucide-react';

export default function WhatIf() {
  const { t, bookings, tripHealth, simulateWhatIf, resetSimulation, simulationActive, simulationResult, formatTime } = useStore();
  const [targetId, setTargetId] = useState(bookings[0]?.id || 1);
  const [delayHours, setDelayHours] = useState(3);
  const [disruptionType, setDisruptionType] = useState('delay');

  const handleSimulate = () => {
    simulateWhatIf({ targetId: Number(targetId), delayHours, type: disruptionType });
  };

  const getHealthColor = (h) => h >= 80 ? 'text-green-500' : h >= 60 ? 'text-amber-500' : 'text-red-500';
  const getHealthStroke = (h) => h >= 80 ? 'stroke-green-500' : h >= 60 ? 'stroke-amber-500' : 'stroke-red-500';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        🔮 {t('whatIfTitle')}
      </h1>
      <p className="text-slate-500 mb-8">{t('whatIfSub')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Simulation Controls</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('selectDisruptionType')}</label>
              <select value={disruptionType} onChange={e => setDisruptionType(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400">
                <option value="delay">{t('flightDelayed')}</option>
                <option value="cancel">{t('flightCancelled')}</option>
                <option value="trainDelay">{t('trainDelayed')}</option>
                <option value="cabFail">{t('cabUnavailable')}</option>
                <option value="weather">{t('weatherDisruption')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('selectBooking')}</label>
              <select value={targetId} onChange={e => setTargetId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400">
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>{b.emoji} {b.name} | {b.from} → {b.to}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('delayDuration')}: <strong>{delayHours} {t('hours')}</strong></label>
              <input type="range" min="1" max="8" value={delayHours} onChange={e => setDelayHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1h</span><span>4h</span><span>8h</span>
              </div>
            </div>

            <button onClick={handleSimulate}
              className="w-full bg-gradient-to-r from-[#1B2A4A] to-[#2E86AB] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg">
              <Zap className="w-5 h-5" /> {t('simulate')}
            </button>

            {simulationActive && (
              <button onClick={resetSimulation}
                className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> {t('tryAnotherScenario')}
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          {!simulationActive ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
              <p className="text-5xl mb-4">🔮</p>
              <p className="text-lg text-slate-500">Run a simulation to see the impact</p>
              <p className="text-sm text-slate-400 mt-2">Select a disruption type, booking, and severity, then click Simulate</p>
            </div>
          ) : simulationResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Health Comparison */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 text-center">{t('tripHealth')}</h3>
                <div className="flex items-center justify-center gap-8">
                  {[
                    { label: t('tripHealthBefore'), value: tripHealth, color: getHealthColor(tripHealth), stroke: getHealthStroke(tripHealth) },
                    { label: t('tripHealthAfter'), value: simulationResult.newHealth, color: getHealthColor(simulationResult.newHealth), stroke: getHealthStroke(simulationResult.newHealth) },
                  ].map((g, i) => (
                    <div key={i} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                          <motion.circle cx="60" cy="60" r="50" fill="none" strokeWidth="10" strokeLinecap="round"
                            className={g.stroke}
                            initial={{ strokeDasharray: '314', strokeDashoffset: '314' }}
                            animate={{ strokeDashoffset: 314 - (314 * g.value / 100) }}
                            transition={{ duration: 1 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-2xl font-extrabold ${g.color}`}>{g.value}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">{g.label}</p>
                    </div>
                  ))}
                  <div className="text-4xl text-slate-300">→</div>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t('bookingsAffected'), value: simulationResult.bookingsAffected, icon: '📋' },
                  { label: t('estimatedAdditionalCost'), value: `₹${simulationResult.costImpact.toLocaleString()}`, icon: '💰' },
                  { label: t('highestRisk'), value: simulationResult.highestRisk, icon: '⚠️' },
                  { label: t('potentialRefund'), value: `₹${simulationResult.refundAvailable.toLocaleString()}`, icon: '💸' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-2xl mb-1">{stat.icon}</p>
                    <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recommended Action */}
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
                <p className="text-sm font-bold text-teal-800 mb-1">💡 {t('recommendedAction')}</p>
                <p className="text-sm text-teal-700">{simulationResult.recommendedAction}</p>
              </div>

              {/* Simulated Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Simulated Itinerary</h3>
                {simulationResult.simBookings.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-xl mb-2 border ${
                      b.status === 'delayed' || b.status === 'missed' ? 'border-red-200 bg-red-50' :
                      b.status === 'atRisk' ? 'border-amber-200 bg-amber-50' :
                      'border-green-200 bg-green-50'
                    }`}>
                    <div className="flex items-center gap-2">
                      <span>{b.emoji}</span>
                      <span className="text-sm font-semibold">{b.name}</span>
                    </div>
                    <span className={`text-xs font-bold ${
                      b.status === 'confirmed' ? 'text-green-600' : b.status === 'delayed' ? 'text-red-600' :
                      b.status === 'missed' ? 'text-red-700' : 'text-amber-600'
                    }`}>
                      {b.status === 'confirmed' ? '🟢 OK' : b.status === 'delayed' ? `🔴 Delayed ${b.delayHours}h` : b.status === 'missed' ? '🔴 Missed' : '🟠 At Risk'}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link to="/disruptions" onClick={() => { const target = bookings.find(b => b.id === Number(targetId)); if (target) { useStore.getState().triggerDisruption({ targetId: Number(targetId), delayHours, type: 'delay', description: `${target.name} delayed by ${delayHours} hours` }); } }}
                  className="flex-1 bg-[#1B2A4A] text-white text-center py-3 rounded-xl font-medium hover:bg-[#243654]">
                  {t('generateRecoveryPlans')}
                </Link>
                <Link to="/assistant" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-400">
                  💬 {t('askRaahiAI')}
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
