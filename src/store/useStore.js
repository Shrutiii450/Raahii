import { create } from 'zustand';
import { demoBookings } from '../data/demoData';
import { translations } from '../i18n/translations';

const getBufferMinutes = (endTime, startTime) => {
  const [eh, em] = endTime.split(':').map(Number);
  const [sh, sm] = startTime.split(':').map(Number);
  return (sh * 60 + sm) - (eh * 60 + em);
};

const getRecommendedBuffer = (fromType, toType) => {
  if (fromType === 'flight' && toType === 'cab') return 60;
  if (fromType === 'flight' && toType === 'train') return 90;
  if (fromType === 'cab' && toType === 'hotel') return 30;
  if (fromType === 'hotel' && toType === 'activity') return 45;
  if (fromType === 'activity' && toType === 'train') return 75;
  if (fromType === 'activity' && toType === 'flight') return 90;
  return 45;
};

const addMinutesToTime = (time, mins) => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
};

const formatTime12 = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

export const useStore = create((set, get) => ({
  language: localStorage.getItem('raahi-lang') || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('raahi-lang', lang);
    set({ language: lang });
  },

  t: (key) => {
    const { language } = get();
    return translations[language]?.[key] || translations['en']?.[key] || key;
  },

  bookings: [...demoBookings],
  originalBookings: [...demoBookings],
  tripHealth: 92,
  originalTripHealth: 92,
  disruptedTripHealth: null,

  disruptions: [],
  activeDisruption: null,

  recoveryPlans: [],
  selectedRecovery: null,
  recoveryApplied: false,
  showRecoveryDetails: null,

  simulationActive: false,
  simulationResult: null,

  profile: {
    name: 'Shruti Sharma',
    email: 'shruti@example.com',
    travelStyle: 'solo',
    budget: 'medium',
    priority: 'minChanges',
    bufferPreference: 'comfortable',
  },

  chatMessages: [],
  chatLoading: false,

  // ========== ACTIONS ==========

  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, { ...booking, id: Date.now(), status: 'confirmed' }]
  })),

  removeBooking: (id) => set((state) => ({
    bookings: state.bookings.filter(b => b.id !== id)
  })),

  // DISRUPTION LOGIC
  triggerDisruption: (disruption) => {
    set((state) => {
      const delayMins = disruption.delayHours * 60;
      const targetBooking = state.bookings.find(b => b.id === disruption.targetId);
      if (!targetBooking) return {};

      const targetIdx = state.bookings.findIndex(b => b.id === disruption.targetId);
      const newEndTime = addMinutesToTime(targetBooking.endTime, delayMins);

      const updatedBookings = state.bookings.map((b, idx) => {
        if (b.id === disruption.targetId) {
          return {
            ...b,
            status: 'delayed',
            delayHours: disruption.delayHours,
            originalEndTime: b.endTime,
            endTime: newEndTime,
            originalStartTime: b.startTime,
            startTime: addMinutesToTime(b.startTime, delayMins),
          };
        }
        if (idx > targetIdx && b.date === targetBooking.date) {
          const prevBooking = state.bookings[idx - 1];
          const prevEndTime = idx - 1 === targetIdx ? newEndTime : prevBooking.endTime;
          const buffer = getBufferMinutes(prevEndTime, b.startTime);

          if (buffer < 0) {
            return { ...b, status: 'missed', riskReason: 'Insufficient time after disruption' };
          } else if (buffer < 30) {
            return { ...b, status: 'atRisk', riskReason: 'Very tight buffer after disruption' };
          } else if (buffer < 60) {
            return { ...b, status: 'atRisk', riskReason: 'Reduced buffer due to upstream delay' };
          }
          return b;
        }
        return b;
      });

      const affected = updatedBookings.filter(b => b.status !== 'confirmed').length;
      const newHealth = Math.max(15, 92 - (affected * 12) - (disruption.delayHours * 5));

      return {
        bookings: updatedBookings,
        disruptions: [...state.disruptions, disruption],
        activeDisruption: disruption,
        tripHealth: newHealth,
        disruptedTripHealth: newHealth,
        recoveryApplied: false,
        selectedRecovery: null,
        recoveryPlans: get().buildRecoveryPlans(updatedBookings, disruption),
      };
    });
  },

  // BUILD RECOVERY PLANS
  buildRecoveryPlans: (bookings, disruption) => {
    const target = bookings.find(b => b.id === disruption.targetId);
    if (!target) return [];

    const planA = {
      id: 'planA',
      type: 'cheapest',
      icon: '💰',
      cost: 1200,
      changes: 2,
      timeLoss: '1 hour delay',
      refund: 500,
      description: 'Rebook cab to later time. Keep hotel, concert, and train unchanged.',
      explanation: 'Plan A minimizes cost by only rebooking the cab and adjusting the pickup time. Your hotel has flexible check-in, so late arrival is fine. Concert and train remain unaffected.',
      newBookings: bookings.map(b => {
        if (b.type === 'cab' && b.status === 'missed') {
          return { ...b, status: 'confirmed', startTime: addMinutesToTime(target.endTime || '16:15', 45), endTime: addMinutesToTime(target.endTime || '16:15', 90), originalStartTime: b.startTime, changed: true };
        }
        if (b.id === disruption.targetId) {
          return { ...b, status: 'delayed', changed: true };
        }
        if (b.status === 'atRisk') return { ...b, status: 'confirmed' };
        return b;
      }),
    };

    const planB = {
      id: 'planB',
      type: 'fastest',
      icon: '⚡',
      cost: 4500,
      changes: 3,
      timeLoss: 'Saves 2 hours',
      refund: 800,
      description: 'Switch to alternative flight AI-315, new cab at 5:00 PM, express transfer.',
      explanation: 'Plan B switches you to Flight AI-315 departing at 1:00 PM, arriving 4:00 PM. A new cab is booked at 4:45 PM. This is the fastest recovery but costs more.',
      newBookings: bookings.map(b => {
        if (b.id === disruption.targetId) {
          return { ...b, name: 'Flight AI-315', startTime: '13:00', endTime: '16:00', status: 'confirmed', bookingRef: 'AI315-SHRUTI', originalStartTime: b.originalStartTime || b.startTime, originalEndTime: b.originalEndTime || b.endTime, changed: true };
        }
        if (b.type === 'cab' && (b.status === 'missed' || b.status === 'atRisk')) {
          return { ...b, status: 'confirmed', startTime: '16:45', endTime: '17:30', originalStartTime: b.startTime, changed: true };
        }
        if (b.status === 'atRisk') return { ...b, status: 'confirmed' };
        return b;
      }),
    };

    const planC = {
      id: 'planC',
      type: 'leastDisruption',
      icon: '⭐',
      cost: 2800,
      changes: 2,
      timeLoss: 'Minimal disruption',
      refund: 800,
      recommended: true,
      description: 'Switch flight to AI-315, push cab to 5:00 PM. Hotel, concert, and train unchanged.',
      explanation: 'Plan C changes only 2 bookings while preserving your hotel, concert, and train. The connection buffer increases from 30 minutes to 90 minutes, significantly reducing risk. This plan is recommended because of your preference for minimum changes.',
      newBookings: bookings.map(b => {
        if (b.id === disruption.targetId) {
          return { ...b, name: 'Flight AI-315', startTime: '13:00', endTime: '16:00', status: 'confirmed', bookingRef: 'AI315-SHRUTI', originalStartTime: b.originalStartTime || b.startTime, originalEndTime: b.originalEndTime || b.endTime, changed: true };
        }
        if (b.type === 'cab' && (b.status === 'missed' || b.status === 'atRisk')) {
          return { ...b, status: 'confirmed', startTime: '17:00', endTime: '17:45', originalStartTime: b.startTime, changed: true };
        }
        if (b.status === 'atRisk') return { ...b, status: 'confirmed' };
        return b;
      }),
    };

    return [planA, planB, planC];
  },

  // APPLY RECOVERY
  applyRecovery: (plan) => {
    set((state) => ({
      bookings: plan.newBookings.map(b => ({ ...b })),
      selectedRecovery: plan,
      recoveryApplied: true,
      activeDisruption: { ...state.activeDisruption, recovered: true },
      tripHealth: 87,
    }));
  },

  resetAll: () => {
    set({
      bookings: [...demoBookings],
      tripHealth: 92,
      disruptedTripHealth: null,
      disruptions: [],
      activeDisruption: null,
      recoveryPlans: [],
      selectedRecovery: null,
      recoveryApplied: false,
      showRecoveryDetails: null,
      simulationActive: false,
      simulationResult: null,
    });
  },

  // WHAT-IF SIMULATION
  simulateWhatIf: (scenario) => {
    const state = get();
    const delayMins = scenario.delayHours * 60;
    const target = state.bookings.find(b => b.id === scenario.targetId);
    if (!target) return;

    const targetIdx = state.bookings.findIndex(b => b.id === scenario.targetId);
    const newEndTime = addMinutesToTime(target.endTime, delayMins);

    const simBookings = state.bookings.map((b, idx) => {
      if (b.id === scenario.targetId) {
        return { ...b, status: 'delayed', delayHours: scenario.delayHours, endTime: newEndTime, startTime: addMinutesToTime(b.startTime, delayMins) };
      }
      if (idx > targetIdx && b.date === target.date) {
        const buffer = getBufferMinutes(idx - 1 === targetIdx ? newEndTime : state.bookings[idx-1].endTime, b.startTime);
        if (buffer < 0) return { ...b, status: 'missed' };
        if (buffer < 30) return { ...b, status: 'atRisk' };
        if (buffer < 60) return { ...b, status: 'atRisk' };
      }
      return b;
    });

    const affected = simBookings.filter(b => b.status !== 'confirmed').length;
    const newHealth = Math.max(15, 92 - (affected * 12) - (scenario.delayHours * 5));
    const costImpact = affected * 600 + scenario.delayHours * 200;
    const riskiest = simBookings.find(b => b.status === 'missed') || simBookings.find(b => b.status === 'atRisk');

    set({
      simulationActive: true,
      simulationResult: {
        scenario,
        simBookings,
        bookingsAffected: affected,
        newHealth,
        costImpact,
        refundAvailable: Math.round(costImpact * 0.3),
        highestRisk: riskiest?.name || 'None',
        recommendedAction: `Move cab to ${formatTime12(addMinutesToTime(newEndTime, 45))}`,
      },
    });
  },

  resetSimulation: () => set({ simulationActive: false, simulationResult: null }),

  // PROFILE
  updateProfile: (prefs) => set({ profile: { ...get().profile, ...prefs } }),

  // CHAT
  addChatMessage: (msg) => set((state) => ({
    chatMessages: [...state.chatMessages, msg],
  })),

  setChatLoading: (loading) => set({ chatLoading: loading }),

  // AI RESPONSE
  generateAIResponse: (userMessage) => {
    const state = get();
    const { bookings, tripHealth, activeDisruption } = state;
    const msg = userMessage.toLowerCase();

    let response = '';

    if (msg.includes('connection') || msg.includes('make it') || msg.includes('enough')) {
      const flight = bookings.find(b => b.type === 'flight');
      const cab = bookings.find(b => b.type === 'cab');
      if (flight && cab) {
        const buffer = getBufferMinutes(flight.endTime, cab.startTime);
        if (buffer < 45) {
          response = `⚠️ Your current buffer between ${flight.name} (arriving ${formatTime12(flight.endTime)}) and your cab (${formatTime12(cab.startTime)}) is only ${buffer} minutes.\n\nAt Delhi T3, average exit time is 30-50 minutes including:\n• Deplaning: 10-15 min\n• Baggage: 15-25 min\n• Airport exit: 5-10 min\n\n🟢 I recommend moving your cab to ${formatTime12(addMinutesToTime(flight.endTime, 60))} for a comfortable 60-minute buffer.`;
        } else {
          response = `✅ Your buffer between ${flight.name} and cab is ${buffer} minutes. This should be comfortable for Delhi T3.`;
        }
      }
    } else if (msg.includes('delay') || msg.includes('late') || msg.includes('विलंब')) {
      const flight = bookings.find(b => b.type === 'flight');
      response = `If ${flight?.name || 'your flight'} is delayed by 3 hours:\n\n🔴 Your cab will be missed (was scheduled ${formatTime12(bookings.find(b=>b.type==='cab')?.startTime || '13:45')})\n🟠 Hotel check-in will be delayed\n🟠 Concert timing may be tight\n\n💡 I recommend using the What If? simulator to see the full impact and generate recovery plans.`;
    } else if (msg.includes('risk') || msg.includes('जोखिम')) {
      const riskyBookings = bookings.filter(b => b.status === 'atRisk' || b.status === 'missed' || b.status === 'delayed');
      if (riskyBookings.length > 0) {
        response = `Currently ${riskyBookings.length} booking(s) are at risk:\n\n${riskyBookings.map(b => `• ${b.emoji} ${b.name}: ${b.status}`).join('\n')}\n\nTrip Health: ${tripHealth}/100\n\nVisit the Risk Monitor for detailed analysis.`;
      } else {
        response = `🟢 All your bookings look good! Trip Health is ${tripHealth}/100. No immediate risks detected.`;
      }
    } else if (msg.includes('money') || msg.includes('cost') || msg.includes('lose') || msg.includes('पैसा')) {
      const totalCost = bookings.reduce((sum, b) => sum + b.cost, 0);
      const nonRefundable = bookings.filter(b => b.refund === 'No refund');
      response = `💰 Your total trip cost is ₹${totalCost.toLocaleString()}.\n\n${nonRefundable.length > 0 ? `⚠️ Non-refundable bookings:\n${nonRefundable.map(b => `• ${b.emoji} ${b.name}: ₹${b.cost.toLocaleString()}`).join('\n')}\n\nIn a worst-case disruption, you could lose ₹${nonRefundable.reduce((s,b)=>s+b.cost, 0).toLocaleString()} from non-refundable bookings.` : '✅ Most of your bookings have flexible cancellation policies.'}`;
    } else if (msg.includes('hotel') || msg.includes('change hotel')) {
      const hotel = bookings.find(b => b.type === 'hotel');
      response = `🏨 Your hotel ${hotel?.name || ''} has ${hotel?.cancellationPolicy || 'a flexible policy'}.\n\n${hotel?.status === 'confirmed' ? '✅ No need to change your hotel right now.' : '⚠️ Your hotel check-in may be affected by the current disruption. Check Recovery Plans for options.'}`;
    } else if (msg.includes('recovery') || msg.includes('plan') || msg.includes('पुनर्प्राप्ति')) {
      if (activeDisruption) {
        response = `I've generated 3 recovery plans for the current disruption:\n\n💰 Plan A (Cheapest): ₹1,200 - 2 changes\n⚡ Plan B (Fastest): ₹4,500 - saves 2 hours\n⭐ Plan C (Least Disruption): ₹2,800 - only 2 changes, recommended\n\nVisit Recovery Plans to compare and select one.`;
      } else {
        response = '✅ No active disruption. Your itinerary doesn\'t need recovery right now. Use What If? to simulate scenarios.';
      }
    } else {
      response = `I can help you with:\n\n• Checking connection buffers between bookings\n• Analyzing what happens if a booking is delayed\n• Identifying which bookings are most at risk\n• Estimating potential financial impact\n• Recommending recovery plans\n\nTry asking: "What happens if my flight is delayed?" or "Is my cab connection safe?"`;
    }

    return response;
  },

  // RISK CONNECTIONS
  getRiskConnections: () => {
    const { bookings } = get();
    const connections = [];
    for (let i = 0; i < bookings.length - 1; i++) {
      const from = bookings[i];
      const to = bookings[i + 1];
      if (from.date !== to.date) continue;

      const buffer = getBufferMinutes(from.endTime, to.startTime);
      const recommended = getRecommendedBuffer(from.type, to.type);
      let risk = 'low';
      let riskScore = Math.max(0, Math.min(100, Math.round((1 - buffer / recommended) * 100)));
      if (riskScore < 0) riskScore = 0;

      if (buffer < recommended * 0.4) { risk = 'high'; riskScore = Math.max(riskScore, 70); }
      else if (buffer < recommended * 0.8) { risk = 'medium'; riskScore = Math.max(riskScore, 40); }
      else { risk = 'low'; riskScore = Math.min(riskScore, 25); }

      let explanation = '';
      if (from.type === 'flight' && to.type === 'cab') {
        explanation = 'Airport exit and baggage collection typically takes 30-45 minutes at Delhi airport.';
      } else if (to.type === 'hotel') {
        explanation = 'Hotel check-in buffer accounts for traffic and reception wait time.';
      } else if (from.type === 'activity') {
        explanation = 'Activity end times can be unpredictable. Extra buffer recommended.';
      } else {
        explanation = `Current buffer is ${buffer} minutes. Recommended is ${recommended} minutes.`;
      }

      connections.push({
        from, to, buffer, recommended, risk, riskScore, explanation,
        label: `${from.emoji} ${from.name} → ${to.emoji} ${to.name}`,
      });
    }
    return connections;
  },

  // HELPER
  formatTime: formatTime12,
  getBufferMinutes,
  addMinutesToTime,

  setShowRecoveryDetails: (plan) => set({ showRecoveryDetails: plan }),
}));
