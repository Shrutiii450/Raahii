import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, ArrowRight } from 'lucide-react';

export default function RiskMonitor() {
  const { t, tripHealth, getRiskConnections, formatTime } = useStore();
  const connections = getRiskConnections();

  const getHealthColor = (h) => h >= 80 ? 'text-green-500' : h >= 60 ? 'text-amber-500' : 'text-red-500';
  const riskColors = { low: 'border-green-200 bg-green-50', medium: 'border-amber-200 bg-amber-50', high: 'border-red-200 bg-red-50' };
  const riskBadge = { low: 'bg-green-100 text-green-700', medium: 'bg-amber-100 text-amber-700', high: 'bg-red-100 text-red-700' };
  const riskIcon = { low: '🟢', medium: '🟠', high: '🔴' };

  const lowCount = connections.filter(c => c.risk === 'low').length;
  const medCount = connections.filter(c => c.risk === 'medium').length;
  const highCount = connections.filter(c => c.risk === 'high').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        🛡️ {t('riskMonitor')}
      </h1>
      <p className="text-slate-500 mb-8">Real-time risk assessment for your journey connections.</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Overall Trip Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center mb-8">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">{t('overallTripRisk')}</h2>
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <motion.circle cx="60" cy="60" r="50" fill="none" strokeWidth="10" strokeLinecap="round"
                  className={tripHealth >= 80 ? 'stroke-green-500' : tripHealth >= 60 ? 'stroke-amber-500' : 'stroke-red-500'}
                  initial={{ strokeDasharray: '314', strokeDashoffset: '314' }}
                  animate={{ strokeDashoffset: 314 - (314 * tripHealth / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold ${getHealthColor(tripHealth)}`}>{tripHealth}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>
            <p className="font-semibold text-sm">
              {tripHealth >= 80 ? `🟢 ${t('lowRisk')}` : tripHealth >= 60 ? `🟠 ${t('mediumRisk')}` : `🔴 ${t('highRisk')}`}
            </p>
          </motion.div>

          {/* Connection Risk Cards */}
          {connections.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-lg text-slate-500">{t('noRisk')}</p>
            </div>
          )}

          {connections.map((conn, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${riskColors[conn.risk]}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">{conn.label}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${riskBadge[conn.risk]}`}>
                  {riskIcon[conn.risk]} {conn.risk === 'low' ? t('lowRisk') : conn.risk === 'medium' ? t('mediumRisk') : t('highRisk')}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t('currentBuffer')}</p>
                  <p className="text-lg font-bold text-slate-800">{conn.buffer} {t('min')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t('recommendedBufferLabel')}</p>
                  <p className="text-lg font-bold text-slate-800">{conn.recommended} {t('min')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t('riskScore')}</p>
                  <p className={`text-lg font-bold ${conn.riskScore > 60 ? 'text-red-600' : conn.riskScore > 30 ? 'text-amber-600' : 'text-green-600'}`}>
                    {conn.riskScore}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Buffer Fill</p>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (conn.buffer / conn.recommended) * 100)}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full rounded-full ${conn.risk === 'low' ? 'bg-green-500' : conn.risk === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-sm text-slate-600 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                  <span><strong>{t('whyRisky')}</strong> {conn.explanation}</span>
                </p>
              </div>

              {conn.risk !== 'low' && (
                <div className="mt-4">
                  <Link to="/what-if" className="text-sm text-teal-600 hover:text-teal-500 font-medium flex items-center gap-1">
                    {t('viewAlternatives')} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-72 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">{t('riskSummary')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">🟢 {t('lowRisk')}</span>
                <span className="font-bold text-green-600">{lowCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">🟠 {t('mediumRisk')}</span>
                <span className="font-bold text-amber-600">{medCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">🔴 {t('highRisk')}</span>
                <span className="font-bold text-red-600">{highCount}</span>
              </div>
            </div>
          </div>

          <Link to="/what-if" className="block bg-[#1B2A4A] text-white text-center py-3 rounded-xl font-medium hover:bg-[#243654] transition-colors">
            🔮 {t('whatIf')}
          </Link>
          <Link to="/assistant" className="block bg-teal-500 text-white text-center py-3 rounded-xl font-medium hover:bg-teal-400 transition-colors">
            💬 {t('askRaahiAI')}
          </Link>
        </div>
      </div>
    </div>
  );
}
