import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { MapPin, IndianRupee, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const statusColors = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  delayed: 'bg-red-50 text-red-700 border-red-200',
  atRisk: 'bg-amber-50 text-amber-700 border-amber-200',
  missed: 'bg-red-100 text-red-800 border-red-300',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
  lateCheckin: 'bg-amber-50 text-amber-700 border-amber-200',
};

const statusIcons = { confirmed: '🟢', delayed: '🔴', atRisk: '🟠', missed: '🔴', cancelled: '⚫', lateCheckin: '🟠' };

export default function MyTrip() {
  const { bookings, tripHealth, t, formatTime, activeDisruption, recoveryApplied, resetAll } = useStore();
  const [expanded, setExpanded] = useState(null);
  const totalCost = bookings.reduce((s, b) => s + b.cost, 0);

  const getHealthColor = (h) => h >= 80 ? 'text-green-500' : h >= 60 ? 'text-amber-500' : 'text-red-500';
  const getHealthBg = (h) => h >= 80 ? 'stroke-green-500' : h >= 60 ? 'stroke-amber-500' : 'stroke-red-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Timeline */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p style={{ margin: '0 0 6px', color: '#5a7a3a', fontSize: '10px', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>
                Your Journey
              </p>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-.03em', color: '#162518', lineHeight: 1.0 }}>
                {t('myTrip')}
              </h1>
              <p className="text-sm text-slate-500 mt-2">Mumbai → Delhi → Jaipur &nbsp;·&nbsp; {t('traveler')}: Shruti</p>
            </div>
            {(activeDisruption || recoveryApplied) && (
              <button onClick={resetAll} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors w-fit">
                <RefreshCw className="w-4 h-4" /> {t('reset')}
              </button>
            )}
          </div>

          <div className="relative">
            {bookings.map((booking, i) => {
              const isExpanded = expanded === booking.id;
              const isNewDay = i > 0 && booking.date !== bookings[i-1].date;

              return (
                <div key={booking.id}>
                  {isNewDay && (
                    <div className="flex items-center gap-3 ml-8 my-6">
                      <div className="h-px flex-1 bg-slate-200"></div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">Next Day — {booking.date}</span>
                      <div className="h-px flex-1 bg-slate-200"></div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative pl-12 sm:pl-16 mb-4"
                  >
                    {/* Timeline dot & line */}
                    {i < bookings.length - 1 && (
                      <div className={`absolute left-[18px] sm:left-[26px] top-10 bottom-0 w-0.5 ${
                        booking.status === 'delayed' || booking.status === 'missed' ? 'bg-red-300' :
                        booking.status === 'atRisk' ? 'bg-amber-300' : 'bg-slate-200'
                      }`}></div>
                    )}
                    <div className={`absolute left-[10px] sm:left-[18px] top-5 w-4 h-4 rounded-full border-4 border-white shadow z-10 ${
                      booking.status === 'confirmed' ? 'bg-teal-500' :
                      booking.status === 'delayed' || booking.status === 'missed' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`}></div>

                    {/* Card */}
                    <motion.div
                      onClick={() => setExpanded(isExpanded ? null : booking.id)}
                      className={`bg-white rounded-2xl border-2 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                        booking.status === 'delayed' || booking.status === 'missed' ? 'border-red-200 bg-red-50/20' :
                        booking.status === 'atRisk' ? 'border-amber-200 bg-amber-50/20' :
                        booking.changed ? 'border-teal-200 ring-2 ring-teal-50' : 'border-slate-100'
                      }`}
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl sm:text-4xl p-2 bg-slate-50 rounded-xl">{booking.emoji}</span>
                            <div>
                              <h3 className="font-bold text-slate-900 text-base sm:text-lg">{booking.name}</h3>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                                <span>{booking.from}{booking.from !== booking.to ? ` → ${booking.to}` : ''}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-0 pt-2 sm:pt-0 border-slate-100">
                            <span className="text-xs sm:text-sm font-bold text-slate-700">{formatTime(booking.startTime)}</span>
                            <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold border ${statusColors[booking.status] || statusColors.confirmed}`}>
                              {statusIcons[booking.status] || '🟢'} {booking.delayHours ? `${t('delayed')} ${booking.delayHours}h` : t(booking.status)}
                            </span>
                            {booking.changed && <span className="text-xs text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full">🔄 Updated</span>}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm bg-slate-50/50">
                              <div><span className="text-slate-400 block">{t('date')}</span> <span className="font-semibold text-slate-800">{booking.date}</span></div>
                              <div><span className="text-slate-400 block">{t('time')}</span> <span className="font-semibold text-slate-800">{formatTime(booking.startTime)} — {formatTime(booking.endTime)}</span></div>
                              <div><span className="text-slate-400 block">{t('cost')}</span> <span className="font-bold text-slate-900">₹{booking.cost.toLocaleString()}</span></div>
                              <div><span className="text-slate-400 block">{t('bookingRef')}</span> <span className="font-mono text-xs font-semibold text-slate-700">{booking.bookingRef}</span></div>
                              <div className="sm:col-span-2"><span className="text-slate-400 block">{t('cancellationPolicy')}</span> <span className="font-medium text-slate-700">{booking.cancellationPolicy}</span></div>
                              <div className="sm:col-span-2"><span className="text-slate-400 block">{t('refundPolicy')}</span> <span className="font-medium text-slate-700">{booking.refund}</span></div>
                              {booking.originalStartTime && (
                                <div className="sm:col-span-3 bg-teal-50 text-teal-800 p-3 rounded-xl text-xs font-semibold border border-teal-200">
                                  🔄 Schedule Adjusted: Originally {formatTime(booking.originalStartTime)} → New Start: {formatTime(booking.startTime)}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6 lg:sticky lg:top-24">
          {/* Trip Health */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 text-base">{t('tripHealth')}</h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    className={getHealthBg(tripHealth)}
                    strokeWidth="10" strokeLinecap="round"
                    initial={{ strokeDasharray: '314', strokeDashoffset: '314' }}
                    animate={{ strokeDashoffset: 314 - (314 * tripHealth / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-extrabold ${getHealthColor(tripHealth)}`}>{tripHealth}</span>
                </div>
              </div>
            </div>
            <p className="text-center text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              {tripHealth >= 80 ? `🟢 ${t('lowRisk')}` : tripHealth >= 60 ? `🟠 ${t('mediumRisk')}` : `🔴 ${t('highRisk')}`}
            </p>
          </div>

          {/* Trip Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 text-base">{t('tripSummary')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500">{t('totalBookings')}</span>
                <span className="font-bold text-slate-800">{bookings.length}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500">{t('totalCost')}</span>
                <span className="font-bold text-slate-900 flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500">{t('tripRoute')}</span>
                <span className="font-bold text-slate-800">MUM → DEL → JAI</span>
              </div>
            </div>
          </div>

          {activeDisruption && !recoveryApplied && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">🚨 {t('disruptionDetected')}</p>
              <p className="text-xs text-red-600 leading-relaxed">{activeDisruption.description || 'Flight delayed by ' + activeDisruption.delayHours + ' hours'}</p>
            </div>
          )}
          {recoveryApplied && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-bold text-green-800 uppercase tracking-wider">🟢 {t('recoveryApplied')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
