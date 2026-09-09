import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { MapPin, Clock, IndianRupee, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Timeline */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                🧳 {t('myTrip')}
              </h1>
              <p className="text-slate-500 mt-1">Mumbai → Delhi → Jaipur • {t('traveler')}: Shruti</p>
            </div>
            {(activeDisruption || recoveryApplied) && (
              <button onClick={resetAll} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50">
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
                      <span className="text-sm font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Next Day — {booking.date}</span>
                      <div className="h-px flex-1 bg-slate-200"></div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-16 mb-4"
                  >
                    {/* Timeline dot & line */}
                    {i < bookings.length - 1 && (
                      <div className={`absolute left-[26px] top-10 bottom-0 w-0.5 ${
                        booking.status === 'delayed' || booking.status === 'missed' ? 'bg-red-300' :
                        booking.status === 'atRisk' ? 'bg-amber-300' : 'bg-slate-200'
                      }`}></div>
                    )}
                    <div className={`absolute left-[18px] top-5 w-4 h-4 rounded-full border-4 border-white shadow z-10 ${
                      booking.status === 'confirmed' ? 'bg-teal-500' :
                      booking.status === 'delayed' || booking.status === 'missed' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`}></div>

                    {/* Time label */}
                    <div className="absolute left-0 top-5 -translate-x-full pr-6 hidden">
                      <span className="text-xs font-semibold text-slate-400">{formatTime(booking.startTime)}</span>
                    </div>

                    {/* Card */}
                    <motion.div
                      onClick={() => setExpanded(isExpanded ? null : booking.id)}
                      className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                        booking.status === 'delayed' || booking.status === 'missed' ? 'border-red-200' :
                        booking.status === 'atRisk' ? 'border-amber-200' :
                        booking.changed ? 'border-teal-200 ring-2 ring-teal-50' : 'border-slate-100'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{booking.emoji}</span>
                            <div>
                              <h3 className="font-bold text-slate-900">{booking.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-3 h-3" />
                                <span>{booking.from}{booking.from !== booking.to ? ` → ${booking.to}` : ''}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="text-sm font-semibold text-slate-700">{formatTime(booking.startTime)}</span>
                            <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold border ${statusColors[booking.status] || statusColors.confirmed}`}>
                              {statusIcons[booking.status] || '🟢'} {booking.delayHours ? `${t('delayed')} ${booking.delayHours}h` : t(booking.status)}
                            </span>
                            {booking.changed && <span className="text-xs text-teal-600 font-medium">🔄 Updated</span>}
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
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-sm">
                              <div><span className="text-slate-400">{t('date')}:</span> <span className="font-medium">{booking.date}</span></div>
                              <div><span className="text-slate-400">{t('time')}:</span> <span className="font-medium">{formatTime(booking.startTime)} — {formatTime(booking.endTime)}</span></div>
                              <div><span className="text-slate-400">{t('cost')}:</span> <span className="font-medium">₹{booking.cost.toLocaleString()}</span></div>
                              <div><span className="text-slate-400">{t('bookingRef')}:</span> <span className="font-medium font-mono text-xs">{booking.bookingRef}</span></div>
                              <div className="col-span-2"><span className="text-slate-400">{t('cancellationPolicy')}:</span> <span className="font-medium">{booking.cancellationPolicy}</span></div>
                              <div className="col-span-2"><span className="text-slate-400">{t('refundPolicy')}:</span> <span className="font-medium">{booking.refund}</span></div>
                              {booking.originalStartTime && (
                                <div className="col-span-2 bg-teal-50 text-teal-800 p-2 rounded-lg text-xs">
                                  🔄 Original time: {formatTime(booking.originalStartTime)} → New: {formatTime(booking.startTime)}
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
        <div className="w-full md:w-80 space-y-6">
          {/* Trip Health */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">{t('tripHealth')}</h3>
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
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-extrabold ${getHealthColor(tripHealth)}`}>{tripHealth}</span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-semibold text-slate-600">
              {tripHealth >= 80 ? `🟢 ${t('lowRisk')}` : tripHealth >= 60 ? `🟠 ${t('mediumRisk')}` : `🔴 ${t('highRisk')}`}
            </p>
          </div>

          {/* Trip Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">{t('tripSummary')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('totalBookings')}</span>
                <span className="font-semibold">{bookings.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('totalCost')}</span>
                <span className="font-semibold flex items-center gap-1"><IndianRupee className="w-3 h-3" />{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('tripRoute')}</span>
                <span className="font-semibold">MUM → DEL → JAI</span>
              </div>
            </div>
          </div>

          {activeDisruption && !recoveryApplied && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-red-700 mb-2">🚨 {t('disruptionDetected')}</p>
              <p className="text-xs text-red-600">{activeDisruption.description || 'Flight delayed by ' + activeDisruption.delayHours + ' hours'}</p>
            </div>
          )}
          {recoveryApplied && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-green-700">🟢 {t('recoveryApplied')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
