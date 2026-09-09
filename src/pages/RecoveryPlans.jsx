import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Star, Zap, DollarSign, ArrowRight, Check, X } from 'lucide-react';

export default function RecoveryPlans() {
  const { t, recoveryPlans, activeDisruption, applyRecovery, showRecoveryDetails, setShowRecoveryDetails, formatTime, bookings, profile } = useStore();
  const navigate = useNavigate();

  const hasDisruption = activeDisruption && recoveryPlans.length > 0;
  const planIcons = { cheapest: <DollarSign className="w-6 h-6" />, fastest: <Zap className="w-6 h-6" />, leastDisruption: <Star className="w-6 h-6" /> };
  const planEmojis = { cheapest: '💰', fastest: '⚡', leastDisruption: '⭐' };

  const sortedPlans = [...recoveryPlans].sort((a, b) => {
    if (profile.priority === 'lowestCost') return a.cost - b.cost;
    if (profile.priority === 'shortestTime') return a.type === 'fastest' ? -1 : 1;
    return a.recommended ? -1 : 1;
  });

  const handleConfirm = (plan) => {
    applyRecovery(plan);
    navigate('/recovery-monitor');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        🔄 {t('recoveryPlansTitle')}
      </h1>
      <p className="text-slate-500 mb-8">{t('recoverySub')}</p>

      {!hasDisruption ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-4">🟢</p>
          <p className="text-lg text-slate-600">{t('noRecoveryNeeded')}</p>
          <p className="text-sm text-slate-400 mt-2">Report a disruption or run a What If simulation first.</p>
        </div>
      ) : (
        <>
          {/* Disruption Banner */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <p className="font-bold text-red-800">{activeDisruption.description}</p>
              <p className="text-sm text-red-600">{bookings.filter(b => b.status !== 'confirmed').length} bookings affected</p>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {sortedPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`relative bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all ${
                  plan.recommended ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-100'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-0 w-full bg-teal-500 text-white text-center text-xs font-bold py-1.5">
                    ⭐ {t('recommended')}
                  </div>
                )}

                <div className={`p-6 ${plan.recommended ? 'pt-10' : ''}`}>
                  <div className="text-center mb-6">
                    <span className="text-4xl mb-3 block">{planEmojis[plan.type]}</span>
                    <h3 className="text-xl font-bold text-slate-900">{t(plan.type)}</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t('planCost')}</span>
                      <span className="font-bold text-slate-800">₹{plan.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t('planChanges')}</span>
                      <span className="font-bold text-slate-800">{plan.changes} bookings</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t('planTimeLoss')}</span>
                      <span className="font-bold text-slate-800">{plan.timeLoss}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t('planRefund')}</span>
                      <span className="font-bold text-green-600">₹{plan.refund.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-6">{plan.description}</p>

                  <div className="space-y-2">
                    <button onClick={() => setShowRecoveryDetails(plan)}
                      className="w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors">
                      {t('viewDetails')}
                    </button>
                    <button onClick={() => setShowRecoveryDetails(plan)}
                      className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                        plan.recommended ? 'bg-teal-500 text-white hover:bg-teal-400' : 'bg-[#1B2A4A] text-white hover:bg-[#243654]'
                      }`}>
                      {t('selectPlan')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Financial Impact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Financial Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-slate-500">{t('originalCost')}</p>
                <p className="text-xl font-bold text-slate-800">₹{bookings.reduce((s,b)=>s+b.cost,0).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">{t('recoveryCost')}</p>
                <p className="text-xl font-bold text-amber-600">₹2,800</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">{t('refundReceived')}</p>
                <p className="text-xl font-bold text-green-600">₹800</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">{t('netAdditional')}</p>
                <p className="text-xl font-bold text-red-600">₹2,000</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recovery Details Modal */}
      <AnimatePresence>
        {showRecoveryDetails && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowRecoveryDetails(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {planEmojis[showRecoveryDetails.type]} {t(showRecoveryDetails.type)} — {t('whatWillChange')}
                  </h2>
                  <button onClick={() => setShowRecoveryDetails(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Before / After */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-red-600 mb-3">🔴 {t('before')}</h3>
                    {bookings.map(b => (
                      <div key={b.id} className="flex items-center gap-2 py-2 text-sm border-b border-slate-50">
                        <span>{b.emoji}</span>
                        <span className="text-slate-700">{b.name}</span>
                        <span className="text-xs text-slate-400 ml-auto">{formatTime(b.originalStartTime || b.startTime)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-green-600 mb-3">🟢 {t('after')}</h3>
                    {showRecoveryDetails.newBookings.map(b => (
                      <div key={b.id} className={`flex items-center gap-2 py-2 text-sm border-b border-slate-50 ${b.changed ? 'bg-teal-50 rounded px-2 -mx-2' : ''}`}>
                        <span>{b.emoji}</span>
                        <span className="text-slate-700">{b.name}</span>
                        <span className="text-xs text-slate-400 ml-auto">{formatTime(b.startTime)}</span>
                        {b.changed && <span className="text-xs text-teal-600 font-bold">🔄</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change List */}
                <div className="mb-6">
                  <h3 className="font-bold text-slate-900 mb-3">{t('changed')}:</h3>
                  {showRecoveryDetails.newBookings.filter(b => b.changed).map(b => (
                    <div key={b.id} className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{b.emoji}</span>
                        <span className="font-semibold text-slate-800">🔄 {b.name}</span>
                      </div>
                      {b.originalStartTime && (
                        <p className="text-sm text-slate-600">
                          Time: <span className="line-through text-red-500">{formatTime(b.originalStartTime)}</span> → <span className="text-green-600 font-semibold">{formatTime(b.startTime)}</span>
                        </p>
                      )}
                      {b.originalEndTime && (
                        <p className="text-sm text-slate-600">
                          Arrival: <span className="line-through text-red-500">{formatTime(b.originalEndTime)}</span> → <span className="text-green-600 font-semibold">{formatTime(b.endTime)}</span>
                        </p>
                      )}
                    </div>
                  ))}

                  <h3 className="font-bold text-slate-900 mb-3 mt-4">{t('unchanged')}:</h3>
                  {showRecoveryDetails.newBookings.filter(b => !b.changed).map(b => (
                    <div key={b.id} className="flex items-center gap-2 py-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{b.emoji} {b.name}</span>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm font-bold text-blue-800 mb-1">💡 {t('whyRecommended')}</p>
                  <p className="text-sm text-blue-700">{showRecoveryDetails.explanation}</p>
                </div>

                {/* Confirm */}
                <button onClick={() => handleConfirm(showRecoveryDetails)}
                  className="w-full bg-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-400 transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <Check className="w-5 h-5" /> {t('confirmRecovery')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
