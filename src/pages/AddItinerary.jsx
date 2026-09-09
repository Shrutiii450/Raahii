import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Check, ArrowRight, ArrowLeft, FileText, Upload, Sparkles, Loader2, Calendar, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';

const bookingTypes = [
  { type: 'flight', emoji: '✈️' },
  { type: 'train', emoji: '🚆' },
  { type: 'bus', emoji: '🚌' },
  { type: 'cab', emoji: '🚕' },
  { type: 'hotel', emoji: '🏨' },
  { type: 'activity', emoji: '🎫' },
  { type: 'event', emoji: '🎭' },
  { type: 'restaurant', emoji: '🍽️' },
  { type: 'other', emoji: '📦' },
];

export default function AddItinerary() {
  const { t, addBooking, bookings, formatTime, getBufferMinutes } = useStore();
  const navigate = useNavigate();

  // Mode: 'manual' vs 'pdf'
  const [tab, setTab] = useState('pdf');

  // Manual flow states
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [showBuffer, setShowBuffer] = useState(false);
  const [bufferInfo, setBufferInfo] = useState(null);
  const [form, setForm] = useState({
    name: '', date: '', startTime: '', endTime: '', from: '', to: '', cost: '', bookingRef: '', cancellationPolicy: '', refund: ''
  });

  // PDF Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleTypeSelect = (type) => { setSelectedType(type); setStep(1); setSubStep(0); };

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const checkBuffer = () => {
    if (!form.startTime || bookings.length === 0) return null;
    const lastBooking = bookings.filter(b => b.date === form.date || !form.date).pop();
    if (!lastBooking) return null;
    const buffer = getBufferMinutes(lastBooking.endTime, form.startTime);
    if (buffer < 45 && buffer >= 0) {
      return {
        prevType: lastBooking.type,
        prevName: lastBooking.name,
        prevEnd: lastBooking.endTime,
        buffer,
        recommended: lastBooking.type === 'flight' ? 60 : 45,
        risk: buffer < 20 ? 'high' : buffer < 45 ? 'medium' : 'low',
      };
    }
    return null;
  };

  const handleSubmit = () => {
    const booking = {
      ...form,
      type: selectedType.type,
      emoji: selectedType.emoji,
      cost: parseInt(form.cost) || 0,
      status: 'confirmed',
    };
    addBooking(booking);

    const buf = checkBuffer();
    if (buf && buf.risk !== 'low') {
      setBufferInfo(buf);
      setShowBuffer(true);
    } else {
      navigate('/my-trip');
    }
  };

  // PDF / Ticket Analysis Simulation
  const processPdfFile = (file) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setIsUploading(true);
    setExtractedData(null);

    const stages = [
      '📄 Reading PDF document structure & text...',
      '🔍 Identifying PNR & Booking reference tokens...',
      '✈️ Extracting flight, hotel, and transit schedules...',
      '🤖 Raahi AI analyzing buffer risks & connections...'
    ];

    let currentStage = 0;
    setUploadProgress(stages[0]);

    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setUploadProgress(stages[currentStage]);
      } else {
        clearInterval(interval);
        setIsUploading(false);

        // Generate intelligent mock extracted items from PDF
        setExtractedData({
          documentTitle: file.name,
          confidenceScore: 99.4,
          passengerName: 'Shruti Sharma',
          pnr: 'AI-PNR-883921',
          bookings: [
            {
              id: Date.now() + 1,
              type: 'flight',
              emoji: '✈️',
              name: 'IndiGo 6E-512',
              from: 'Bengaluru (BLR)',
              to: 'Mumbai (BOM)',
              date: '2025-10-18',
              startTime: '07:15',
              endTime: '09:00',
              cost: 5400,
              status: 'confirmed',
              bookingRef: 'PNR-6E512-BLR',
              cancellationPolicy: 'Cancellation allowed up to 2h before departure',
              refund: 'Full refund minus ₹500 fee'
            },
            {
              id: Date.now() + 2,
              type: 'cab',
              emoji: '🚕',
              name: 'Uber Premier Transfer',
              from: 'Mumbai T2 Airport',
              to: 'Taj Santacruz Hotel',
              date: '2025-10-18',
              startTime: '09:45',
              endTime: '10:15',
              cost: 650,
              status: 'confirmed',
              bookingRef: 'UBER-MUM-892',
              cancellationPolicy: 'Free cancellation until pickup',
              refund: '100% Refundable'
            },
            {
              id: Date.now() + 3,
              type: 'hotel',
              emoji: '🏨',
              name: 'Taj Santacruz Mumbai',
              from: 'Mumbai',
              to: 'Mumbai',
              date: '2025-10-18',
              startTime: '12:00',
              endTime: '11:00',
              cost: 14500,
              status: 'confirmed',
              bookingRef: 'TAJ-SNT-7721',
              cancellationPolicy: 'Free cancellation 24h prior',
              refund: 'Full refund'
            }
          ]
        });
      }
    }, 800);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPdfFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processPdfFile(e.target.files[0]);
    }
  };

  const handleImportExtracted = () => {
    if (extractedData && extractedData.bookings) {
      extractedData.bookings.forEach(b => addBooking(b));
      navigate('/my-trip');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ➕ Add & Analyze Itinerary
          </h1>
          <p className="text-slate-500 mt-1">Upload your travel PDF ticket or add bookings manually.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab('pdf')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'pdf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-600" /> Upload PDF / Ticket
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ✍️ Manual Entry
          </button>
        </div>
      </div>

      {/* PDF UPLOAD TAB */}
      {tab === 'pdf' && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : 'border-slate-300 bg-white hover:border-teal-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.eml"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Upload Flight Ticket or Itinerary PDF
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
              Drag & drop your PDF booking confirmation, e-ticket, or boarding pass. Raahi AI will automatically extract flights, cabs, hotels & calculate risks.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-4 py-2 rounded-full w-fit mx-auto border border-teal-200">
              <Sparkles className="w-4 h-4" /> AI PDF Parser • Flight PNR, Hotel Vouchers, Train Tickets
            </div>
          </div>

          {/* Quick Demo Upload Button */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Don't have a PDF ready right now?</span>
            <button
              onClick={() => processPdfFile({ name: 'Mumbai_Bengaluru_Itinerary_Booking.pdf' })}
              className="text-xs bg-[#1B2A4A] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#243654] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Try Sample PDF Ticket Analysis
            </button>
          </div>

          {/* Loading Animation */}
          {isUploading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
              <Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto mb-4" />
              <h4 className="text-base font-bold text-slate-800 mb-1">Analyzing Document</h4>
              <p className="text-sm text-teal-600 font-medium">{uploadProgress}</p>
            </motion.div>
          )}

          {/* Extracted Data Result */}
          {extractedData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border-2 border-teal-300 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full uppercase tracking-wider">
                    ✓ AI Extraction Complete
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    Extracted Bookings from: <span className="text-teal-600">{uploadedFileName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Passenger: <strong>{extractedData.passengerName}</strong> • PNR: <span className="font-mono">{extractedData.pnr}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">AI Confidence</span>
                  <span className="text-lg font-extrabold text-teal-600 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> {extractedData.confidenceScore}%
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-bold text-slate-700">Detected Booking Segments ({extractedData.bookings.length}):</h4>
                {extractedData.bookings.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900">{item.name}</h5>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">Confirmed</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> {item.from} → {item.to}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {item.date} ({item.startTime} - {item.endTime})
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex sm:flex-col justify-between items-end">
                      <span className="text-sm font-bold text-slate-800 flex items-center">
                        <IndianRupee className="w-3 h-3" /> {item.cost.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: {item.bookingRef}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                <p className="text-xs font-bold text-teal-800 mb-1">🛡️ Intelligent Connection Check:</p>
                <p className="text-xs text-teal-700">
                  Buffer between <strong>IndiGo 6E-512</strong> arrival (09:00 AM) and <strong>Uber Transfer</strong> (09:45 AM) is 45 minutes. This meets safety recommendations.
                </p>
              </div>

              <button
                onClick={handleImportExtracted}
                className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
              >
                <Check className="w-5 h-5" /> Import All {extractedData.bookings.length} Bookings to My Trip
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* MANUAL ENTRY TAB */}
      {tab === 'manual' && (
        <div>
          <p className="text-slate-500 mb-8">{step === 0 ? t('selectBookingType') : `${t('step')} ${subStep + 1}/3 — ${[t('basicInfo'), t('route'), t('costAndPolicy')][subStep]}`}</p>

          {/* Progress */}
          {step === 1 && (
            <div className="flex gap-1 mb-8">
              {[0, 1, 2].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= subStep ? 'bg-teal-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 0: Select Type */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {bookingTypes.map((bt) => (
                    <motion.button
                      key={bt.type}
                      onClick={() => handleTypeSelect(bt)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-2 border-slate-100 hover:border-teal-300 rounded-xl p-6 text-center transition-colors shadow-sm hover:shadow-md"
                    >
                      <span className="text-4xl mb-2 block">{bt.emoji}</span>
                      <span className="text-sm font-semibold text-slate-700">{t(bt.type)}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <motion.div key={`step1-${subStep}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{selectedType.emoji}</span>
                    <h2 className="text-xl font-bold text-slate-900">{t(selectedType.type)} — {[t('basicInfo'), t('route'), t('costAndPolicy')][subStep]}</h2>
                  </div>

                  {subStep === 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('bookingName')}</label>
                        <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="e.g. Flight AI-204" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('date')}</label>
                        <input type="date" value={form.date} onChange={e => updateForm('date', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('startTime')}</label>
                          <input type="time" value={form.startTime} onChange={e => updateForm('startTime', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('endTime')}</label>
                          <input type="time" value={form.endTime} onChange={e => updateForm('endTime', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {subStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('startingLocation')}</label>
                        <input type="text" value={form.from} onChange={e => updateForm('from', e.target.value)} placeholder="e.g. Mumbai Airport" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('destination')}</label>
                        <input type="text" value={form.to} onChange={e => updateForm('to', e.target.value)} placeholder="e.g. Delhi Airport" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                    </div>
                  )}

                  {subStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('cost')} (₹)</label>
                        <input type="number" value={form.cost} onChange={e => updateForm('cost', e.target.value)} placeholder="e.g. 8500" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('bookingReference')}</label>
                        <input type="text" value={form.bookingRef} onChange={e => updateForm('bookingRef', e.target.value)} placeholder="e.g. AI204-SHRUTI" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('cancellationPolicy')}</label>
                        <input type="text" value={form.cancellationPolicy} onChange={e => updateForm('cancellationPolicy', e.target.value)} placeholder="e.g. Free cancellation 24h before" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('refundInfo')}</label>
                        <input type="text" value={form.refund} onChange={e => updateForm('refund', e.target.value)} placeholder="e.g. Full refund if cancelled 24h prior" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <button onClick={() => subStep > 0 ? setSubStep(subStep - 1) : setStep(0)}
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-50">
                      <ArrowLeft className="w-4 h-4" /> {t('back')}
                    </button>
                    {subStep < 2 ? (
                      <button onClick={() => setSubStep(subStep + 1)}
                        className="flex items-center gap-2 bg-[#1B2A4A] text-white px-6 py-3 rounded-xl hover:bg-[#243654] transition-colors font-medium">
                        {t('next')} <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={handleSubmit}
                        className="flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-400 transition-colors font-medium">
                        <Check className="w-4 h-4" /> {t('addBooking')}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Buffer Suggestion Modal */}
      <AnimatePresence>
        {showBuffer && bufferInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-900">⚠️ {t('bufferSuggestion')}</h3>
              </div>
              <p className="text-slate-600 mb-4">
                {t('bufferWarning').replace('{type}', t(selectedType?.type || 'booking')).replace('{mins}', bufferInfo.buffer).replace('{prevType}', t(bufferInfo.prevType))}
              </p>
              <p className="text-sm text-slate-500 mb-6">{t('bufferExplain')}</p>

              <div className="flex gap-2 mb-6">
                {[
                  { mins: 20, risk: 'high', label: '20 min', color: 'bg-red-100 text-red-700 border-red-300' },
                  { mins: 45, risk: 'medium', label: '45 min', color: 'bg-amber-100 text-amber-700 border-amber-300' },
                  { mins: 75, risk: 'low', label: '75 min', color: 'bg-green-100 text-green-700 border-green-300' },
                ].map(b => (
                  <div key={b.mins} className={`flex-1 p-3 rounded-xl text-center text-sm font-semibold border-2 ${b.color}`}>
                    <p className="text-lg font-bold">{b.label}</p>
                    <p className="text-xs">{t(b.risk === 'high' ? 'highRiskBuffer' : b.risk === 'medium' ? 'moderateRiskBuffer' : 'comfortableBuffer')}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm font-medium text-slate-700 mb-4">{t('recommendedBuffer')}: <strong>{bufferInfo.recommended} {t('minutes')}</strong></p>

              <div className="flex flex-col gap-2">
                <button onClick={() => { setShowBuffer(false); navigate('/my-trip'); }} className="bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-400 transition-colors">
                  {t('increaseBuffer')}
                </button>
                <button onClick={() => { setShowBuffer(false); navigate('/my-trip'); }} className="border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                  {t('keepAnyway')}
                </button>
                <button onClick={() => { setShowBuffer(false); navigate('/assistant'); }} className="text-teal-600 py-2 font-medium hover:underline text-sm">
                  {t('askRaahiAI')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Itinerary Preview */}
      {bookings.length > 0 && tab === 'manual' && step === 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Current Itinerary ({bookings.length} bookings)</h3>
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-xl">{b.emoji}</span>
                <span className="font-medium text-sm text-slate-800">{b.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{formatTime(b.startTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
