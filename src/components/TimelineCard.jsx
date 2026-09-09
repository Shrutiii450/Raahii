import { useStore } from '../store/useStore';
import { ShieldAlert, CheckCircle2, Clock, MapPin, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimelineCard({ booking }) {
  const { t } = useStore();
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      case 'atRisk': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4 mr-1" />;
      case 'atRisk': return <ShieldAlert className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="relative pl-12 sm:pl-16 mb-8 w-full">
      {/* Node dot on timeline */}
      <div className={`absolute left-0 sm:left-2 top-6 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 
        ${booking.status === 'delayed' ? 'bg-red-500' : 
          booking.status === 'atRisk' ? 'bg-amber-500' : 'bg-teal-500'}`}
      ></div>

      <motion.div 
        layout
        onClick={() => setExpanded(!expanded)}
        className={`bg-white rounded-xl shadow-sm border p-4 sm:p-5 cursor-pointer transition-all hover:shadow-md
          ${booking.status === 'delayed' ? 'border-red-200' : 
            booking.status === 'atRisk' ? 'border-amber-200' : 'border-slate-200'}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl sm:text-4xl bg-slate-50 p-3 rounded-lg border border-slate-100">
              {booking.emoji}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">{booking.name}</h3>
              <div className="flex items-center text-sm text-slate-500 mt-1 space-x-3">
                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1"/> {booking.startTime} - {booking.endTime}</span>
                <span className="hidden sm:flex items-center"><MapPin className="w-3.5 h-3.5 mr-1"/> {booking.from} {booking.to && booking.to !== booking.from ? `→ ${booking.to}` : ''}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              {t(booking.status)}
              {booking.delayMinutes && ` (${booking.delayMinutes}m)`}
            </span>
            <span className="font-semibold text-slate-700">₹{booking.cost}</span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">{t('bookingRef')}</p>
                  <p className="font-medium text-slate-800">{booking.bookingRef}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">{t('date')}</p>
                  <p className="font-medium text-slate-800">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">{t('cancellationPolicy')}</p>
                  <p className="font-medium text-slate-800">{booking.cancellationPolicy}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">{t('refundPolicy')}</p>
                  <p className="font-medium text-slate-800">{booking.refundPolicy}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 opacity-50 sm:block hidden">
          {expanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
        </div>
      </motion.div>
    </div>
  );
}
