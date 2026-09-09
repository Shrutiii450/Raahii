import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, RefreshCw } from 'lucide-react';

export default function RecoveryMonitor() {
  const { t, recoveryApplied, selectedRecovery, tripHealth, disruptedTripHealth, bookings, formatTime, resetAll } = useStore();

  const getHealthColor = (h) => h >= 80 ? 'text-green-500' : h >= 60 ? 'text-amber-500' : 'text-red-500';
  const getHealthStroke = (h) => h >= 80 ? 'stroke-green-500' : h >= 60 ? 'stroke-amber-500' : 'stroke-red-500';

  if (!recoveryApplied) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          📋 {t('recoveryMonitor')}
        </h1>
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 mt-8">
          <p className="text-4xl mb-4">🟢</p>
          <p className="text-lg text-slate-600">{t('noRecoveryNeeded')}</p>
          <p className="text-sm text-slate-400 mt-2">Recovery monitor will activate after you apply a recovery plan.</p>
        </div>
      </div>
    );
  }

  const healthStages = [
    { label: t('beforeDisruption'), value: 92, color: getHealthColor(92), stroke: getHealthStroke(92) },
    { label: t('duringDisruption'), value: disruptedTripHealth || 58, color: getHealthColor(disruptedTripHealth || 58), stroke: getHealthStroke(disruptedTripHealth || 58) },
    { label: t('afterRecovery'), value: tripHealth, color: getHealthColor(tripHealth), stroke: getHealthStroke(tripHealth) },
  ];

  const changedBookings = bookings.filter(b => b.changed);
  const unchangedBookings = bookings.filter(b => !b.changed);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            📋 {t('recoveryMonitor')}
          </h1>
          <p className="text-slate-500">{t('recoveryAppliedSub')}</p>
        </div>
        <button onClick={resetAll} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" /> {t('reset')}
        </button>
      </div>

      {/* Success Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-green-500 text-white p-6 rounded-2xl mb-8 flex items-center gap-4 shadow-lg">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Check className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold">🟢 {t('recoveryApplied')}</h2>
          <p className="text-green-100 text-sm">{selectedRecovery?.description}</p>
        </div>
      </motion.div>

      {/* Trip Health Journey */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
        <h3 className="font-bold text-slate-900 mb-8 text-center text-lg">{t('tripHealthJourney')}</h3>
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {healthStages.map((stage, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="text-center">
                <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <motion.circle cx="60" cy="60" r="50" fill="none" strokeWidth="10" strokeLinecap="round"
                      className={stage.stroke}
                      initial={{ strokeDasharray: '314', strokeDashoffset: '314' }}
                      animate={{ strokeDashoffset: 314 - (314 * stage.value / 100) }}
                      transition={{ duration: 1.5, delay: i * 0.4, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.4 + 0.5 }}
                      className={`text-2xl md:text-3xl font-extrabold ${stage.color}`}
                    >
                      {stage.value}
                    </motion.span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-medium">{stage.label}</p>
              </div>
              {i < 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 + 0.3 }}>
                  <ArrowRight className="w-6 h-6 text-slate-300" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* What Changed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
        <h3 className="font-bold text-slate-900 mb-6">{t('whatChanged')}</h3>

        {changedBookings.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-teal-700 mb-3 flex items-center gap-2">🔄 {t('changed')}</h4>
            {changedBookings.map(b => (
              <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{b.emoji}</span>
                  <span className="font-semibold text-slate-800">🔄 {b.name}</span>
                </div>
                {b.originalStartTime && (
                  <p className="text-sm text-slate-600">
                    Time: <span className="line-through text-red-400">{formatTime(b.originalStartTime)}</span>
                    {' → '}<span className="text-green-600 font-semibold">{formatTime(b.startTime)}</span>
                  </p>
                )}
                {b.originalEndTime && (
                  <p className="text-sm text-slate-600">
                    Arrival: <span className="line-through text-red-400">{formatTime(b.originalEndTime)}</span>
                    {' → '}<span className="text-green-600 font-semibold">{formatTime(b.endTime)}</span>
                  </p>
                )}
                {b.bookingRef && (
                  <p className="text-xs text-slate-500 mt-1">Ref: {b.bookingRef}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-green-700 mb-3">✓ {t('unchanged')}</h4>
          {unchangedBookings.map(b => (
            <div key={b.id} className="flex items-center gap-3 py-2 text-sm text-slate-600 border-b border-slate-50 last:border-0">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{b.emoji}</span>
              <span>{b.name}</span>
              <span className="text-xs text-slate-400 ml-auto">{formatTime(b.startTime)}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Financial Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
        <h3 className="font-bold text-slate-900 mb-4">{t('financialSummary')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">{t('originalCost')}</p>
            <p className="text-xl font-bold text-slate-800">₹{bookings.reduce((s,b)=>s+b.cost,0).toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <p className="text-xs text-amber-600 mb-1">{t('recoveryCost')}</p>
            <p className="text-xl font-bold text-amber-700">₹{(selectedRecovery?.cost || 2800).toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-xs text-green-600 mb-1">{t('refundReceived')}</p>
            <p className="text-xl font-bold text-green-700">₹{(selectedRecovery?.refund || 800).toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-xs text-red-600 mb-1">{t('netAdditional')}</p>
            <p className="text-xl font-bold text-red-700">₹{((selectedRecovery?.cost || 2800) - (selectedRecovery?.refund || 800)).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Recovery Explanation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <h3 className="font-bold text-blue-800 mb-2">💡 {t('recoveryExplanation')}</h3>
        <p className="text-sm text-blue-700 leading-relaxed">{selectedRecovery?.explanation}</p>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/my-trip" className="flex-1 bg-[#1B2A4A] text-white text-center py-3 rounded-xl font-medium hover:bg-[#243654] transition-colors flex items-center justify-center gap-2">
          🧳 {t('viewFullItinerary')} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/risk" className="flex-1 border border-slate-200 text-slate-700 text-center py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors">
          🛡️ {t('viewRiskMonitor')}
        </Link>
        <Link to="/dependencies" className="flex-1 border border-slate-200 text-slate-700 text-center py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors">
          🔗 {t('viewDependencies')}
        </Link>
      </div>
    </div>
  );
}
