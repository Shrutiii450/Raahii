import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';

export default function Dependencies() {
  const { t, bookings, formatTime } = useStore();
  const [selectedNode, setSelectedNode] = useState(null);

  const getStatusColor = (s) => {
    if (s === 'confirmed') return 'border-green-300 bg-green-50';
    if (s === 'delayed' || s === 'missed') return 'border-red-300 bg-red-50';
    if (s === 'atRisk') return 'border-amber-300 bg-amber-50';
    return 'border-slate-200 bg-white';
  };

  const getLineColor = (from, to) => {
    if (from.status === 'delayed' || from.status === 'missed' || to.status === 'missed') return 'bg-red-400';
    if (from.status === 'atRisk' || to.status === 'atRisk') return 'bg-amber-400';
    return 'bg-green-300';
  };

  const getConnectionLabel = (from, to) => {
    if (from.type === 'flight' && to.type === 'cab') return t('requires');
    if (from.type === 'cab' && to.type === 'hotel') return t('precedes');
    if (from.type === 'hotel' && to.type === 'activity') return t('dependsOn');
    return t('precedes');
  };

  const selectedIdx = selectedNode !== null ? bookings.findIndex(b => b.id === selectedNode) : -1;
  const downstream = selectedIdx >= 0 ? bookings.slice(selectedIdx + 1) : [];
  const directDep = selectedIdx >= 0 && selectedIdx < bookings.length - 1 ? bookings[selectedIdx + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        🔗 {t('dependencies')}
      </h1>
      <p className="text-slate-500 mb-8">{t('dependencySub')}</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Dependency Graph */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 text-center">{t('dependencyMap')}</h3>
            <div className="max-w-md mx-auto">
              {bookings.map((booking, i) => (
                <div key={booking.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedNode(selectedNode === booking.id ? null : booking.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${getStatusColor(booking.status)} ${
                      selectedNode === booking.id ? 'ring-4 ring-teal-200 scale-[1.02]' : 'hover:scale-[1.01]'
                    } ${selectedNode !== null && selectedNode !== booking.id && selectedIdx >= 0 && i > selectedIdx ? 'opacity-80 ring-2 ring-blue-200' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{booking.emoji}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{booking.name}</p>
                        <p className="text-xs text-slate-500">{formatTime(booking.startTime)} — {booking.from !== booking.to ? `${booking.from} → ${booking.to}` : booking.from}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'delayed' ? 'bg-red-100 text-red-700' :
                      booking.status === 'missed' ? 'bg-red-200 text-red-800' :
                      booking.status === 'atRisk' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {booking.status === 'confirmed' ? '🟢' : booking.status === 'delayed' || booking.status === 'missed' ? '🔴' : '🟠'} {t(booking.status)}
                    </span>
                  </motion.div>

                  {/* Connection Line */}
                  {i < bookings.length - 1 && (
                    <div className="flex items-center justify-center py-1">
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: i * 0.1 + 0.05 }}
                          className={`w-0.5 h-4 origin-top ${getLineColor(booking, bookings[i + 1])}`}
                        />
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          getLineColor(booking, bookings[i + 1]).includes('red') ? 'bg-red-100 text-red-600' :
                          getLineColor(booking, bookings[i + 1]).includes('amber') ? 'bg-amber-100 text-amber-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {getConnectionLabel(booking, bookings[i + 1])}
                        </span>
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: i * 0.1 + 0.1 }}
                          className={`w-0.5 h-4 origin-top ${getLineColor(booking, bookings[i + 1])}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl p-4 mt-4 shadow-sm border border-slate-100">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <span className="flex items-center gap-2">🟢 <span className="text-slate-600">{t('safeConnections')}</span></span>
              <span className="flex items-center gap-2">🟠 <span className="text-slate-600">{t('atRisk')}</span></span>
              <span className="flex items-center gap-2">🔴 <span className="text-slate-600">{t('missed')}/{t('delayed')}</span></span>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-full md:w-80">
          {selectedNode !== null ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">
                {bookings.find(b => b.id === selectedNode)?.emoji} {bookings.find(b => b.id === selectedNode)?.name}
              </h3>

              {directDep && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-teal-700 mb-2">{t('directDependency')}</h4>
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span>{directDep.emoji}</span>
                      <span className="text-sm font-medium">{directDep.name}</span>
                    </div>
                    <p className="text-xs text-teal-600 mt-1">Must arrive before {formatTime(directDep.startTime)}</p>
                  </div>
                </div>
              )}

              {downstream.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-blue-700 mb-2">{t('downstreamImpact')}</h4>
                  <div className="space-y-2">
                    {downstream.map(b => (
                      <div key={b.id} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
                        <span>{b.emoji}</span>
                        <span>{b.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    If {bookings.find(b => b.id === selectedNode)?.name} is disrupted, {downstream.length} downstream booking(s) may be affected.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <p className="text-3xl mb-3">👆</p>
              <p className="text-sm text-slate-500">Click any booking node to see its dependencies and downstream impact.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
