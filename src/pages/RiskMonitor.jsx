import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function RiskMonitor() {
  const { t, tripHealth, getRiskConnections } = useStore();
  const connections = getRiskConnections();
  const [selectedConnection, setSelectedConnection] = useState(null);

  const getHealthColor = (h) => (h >= 80 ? 'text-green-600' : h >= 60 ? 'text-amber-600' : 'text-red-600');
  const riskColors = {
    low: 'border-green-200 bg-green-50/50',
    medium: 'border-amber-200 bg-amber-50/50',
    high: 'border-red-200 bg-red-50/50',
  };
  const riskBadge = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  };

  const lowCount = connections.filter((c) => c.risk === 'low').length;
  const medCount = connections.filter((c) => c.risk === 'medium').length;
  const highCount = connections.filter((c) => c.risk === 'high').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-7 h-7 text-[#2d5230]" />
        <h1 className="text-3xl font-heading font-bold text-slate-900">Risk Monitor</h1>
      </div>
      <p className="text-slate-600 mb-8">
        Real-time operational risk assessment for your journey connections.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Overall Trip Health */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center mb-6"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Overall Connection Risk</h2>
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className={tripHealth >= 80 ? 'stroke-green-600' : tripHealth >= 60 ? 'stroke-amber-600' : 'stroke-red-600'}
                  initial={{ strokeDasharray: '314', strokeDashoffset: '314' }}
                  animate={{ strokeDashoffset: 314 - (314 * tripHealth) / 100 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-extrabold ${getHealthColor(tripHealth)}`}>{tripHealth}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>
            <p className="font-semibold text-sm text-slate-700">
              {tripHealth >= 80 ? '● Low Overall Risk' : tripHealth >= 60 ? '● Moderate Buffer Risk' : '● High Risk Detected'}
            </p>
          </motion.div>

          {/* Connection Risk Cards */}
          {connections.map((conn, i) => {
            const isExpanded = selectedConnection === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-xl p-5 shadow-sm border-2 ${riskColors[conn.risk]}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-base">{conn.label}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${riskBadge[conn.risk]}`}>
                    {conn.risk} risk
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-500">Current Buffer</p>
                    <p className="text-base font-bold text-slate-800">{conn.buffer} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Recommended</p>
                    <p className="text-base font-bold text-slate-800">{conn.recommended} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Risk Score</p>
                    <p className={`text-base font-bold ${conn.riskScore > 60 ? 'text-red-600' : conn.riskScore > 30 ? 'text-amber-600' : 'text-green-600'}`}>
                      {conn.riskScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fill</p>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <div
                        style={{ width: `${Math.min(100, (conn.buffer / conn.recommended) * 100)}%` }}
                        className={`h-full rounded-full ${conn.risk === 'low' ? 'bg-green-600' : conn.risk === 'medium' ? 'bg-amber-600' : 'bg-red-600'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-600 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
                    <span><strong>Assessment:</strong> {conn.explanation}</span>
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedConnection(isExpanded ? null : i)}
                    className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Options' : 'Review options'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <Link to="/what-if" className="text-xs text-[#2d5230] hover:underline font-bold flex items-center gap-1">
                    Simulate What-If <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-700 space-y-2"
                    >
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <strong className="block text-slate-900 mb-1">Raahi Recommendation:</strong>
                        <p className="text-slate-600">
                          Increase connection buffer between {conn.from?.name} and {conn.to?.name} by rescheduling the pickup to {conn.to?.startTime || 'later time'}.
                        </p>
                        <Link
                          to="/what-if"
                          className="mt-2 inline-block bg-[#162518] text-white px-3 py-1.5 rounded-md font-semibold text-xs"
                        >
                          Explore Simulation Details
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-72 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3 text-sm">Risk Breakdown</h3>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Low Risk Connections</span>
                <span className="font-bold text-green-600">{lowCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Moderate Risk</span>
                <span className="font-bold text-amber-600">{medCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">High Risk</span>
                <span className="font-bold text-red-600">{highCount}</span>
              </div>
            </div>
          </div>

          <Link
            to="/what-if"
            className="block bg-[#162518] text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-[#233a26] transition-colors"
          >
            Open What-If Simulator
          </Link>
          <Link
            to="/assistant"
            className="block bg-[#2d5230] text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-[#3d6b3e] transition-colors"
          >
            Ask Raahi Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
