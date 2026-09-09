import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { Check, Save } from 'lucide-react';

export default function Profile() {
  const { t, profile, updateProfile } = useStore();
  const [saved, setSaved] = useState(false);
  const [localProfile, setLocalProfile] = useState({ ...profile });

  const update = (key, value) => setLocalProfile(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    updateProfile(localProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const travelStyles = [
    { value: 'solo', emoji: '🚶', label: t('solo') },
    { value: 'couple', emoji: '👫', label: t('couple') },
    { value: 'family', emoji: '👨‍👩‍👧', label: t('family') },
    { value: 'business', emoji: '💼', label: t('business') },
  ];

  const budgets = [
    { value: 'low', emoji: '💰', label: t('low') },
    { value: 'medium', emoji: '💳', label: t('medium') },
    { value: 'flexible', emoji: '💎', label: t('flexible') },
  ];

  const priorities = [
    { value: 'lowestCost', emoji: '💰', label: t('lowestCost') },
    { value: 'shortestTime', emoji: '⏱️', label: t('shortestTime') },
    { value: 'maxComfort', emoji: '🛋️', label: t('maxComfort') },
    { value: 'minChanges', emoji: '🔄', label: t('minChanges') },
    { value: 'lowestRisk', emoji: '🛡️', label: t('lowestRiskPref') },
  ];

  const bufferPrefs = [
    { value: 'short', emoji: '⚡', label: t('short') },
    { value: 'normal', emoji: '⏰', label: t('normal') },
    { value: 'comfortable', emoji: '🟢', label: t('comfortable') },
  ];

  const rankingMap = {
    lowestCost: [t('cheapest'), t('leastDisruption'), t('fastest')],
    shortestTime: [t('fastest'), t('leastDisruption'), t('cheapest')],
    maxComfort: [t('leastDisruption'), t('cheapest'), t('fastest')],
    minChanges: [t('leastDisruption'), t('cheapest'), t('fastest')],
    lowestRisk: [t('leastDisruption'), t('fastest'), t('cheapest')],
  };

  const OptionCard = ({ options, selected, onSelect, columns = 4 }) => (
    <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-3`}>
      {options.map(opt => (
        <motion.button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-xl border-2 text-center transition-all ${
            selected === opt.value
              ? 'border-teal-400 bg-teal-50 ring-2 ring-teal-100 shadow-sm'
              : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
          }`}
        >
          <span className="text-2xl mb-2 block">{opt.emoji}</span>
          <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
          {selected === opt.value && <Check className="w-4 h-4 text-teal-500 mx-auto mt-1" />}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        👤 {t('profileTitle')}
      </h1>
      <p className="text-slate-500 mb-8">{t('profileSub')}</p>

      {/* User Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-[#2E86AB] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            S
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <p className="text-xs text-slate-400">Member since 2025</p>
          </div>
        </div>
      </div>

      {/* Travel Style */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">{t('travelStyle')}</h3>
        <OptionCard options={travelStyles} selected={localProfile.travelStyle} onSelect={v => update('travelStyle', v)} />
      </div>

      {/* Budget */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">{t('budget')}</h3>
        <OptionCard options={budgets} selected={localProfile.budget} onSelect={v => update('budget', v)} columns={3} />
      </div>

      {/* Priority */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">{t('priority')}</h3>
        <OptionCard options={priorities} selected={localProfile.priority} onSelect={v => update('priority', v)} columns={5} />
      </div>

      {/* Buffer Preference */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">{t('bufferPreference')}</h3>
        <OptionCard options={bufferPrefs} selected={localProfile.bufferPreference} onSelect={v => update('bufferPreference', v)} columns={3} />
      </div>

      {/* Preference Impact */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-blue-800 mb-3">💡 {t('preferenceImpact')}</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>✓ Prioritize recovery plans with <strong>{priorities.find(p => p.value === localProfile.priority)?.label}</strong></li>
          <li>✓ Recommend <strong>{bufferPrefs.find(b => b.value === localProfile.bufferPreference)?.label}</strong> buffer times</li>
          <li>✓ Optimize for <strong>{budgets.find(b => b.value === localProfile.budget)?.label}</strong> budget travelers</li>
        </ul>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm font-semibold text-blue-800 mb-2">Recovery Plan Ranking:</p>
          <div className="flex items-center gap-2">
            {(rankingMap[localProfile.priority] || rankingMap.minChanges).map((plan, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                  {i + 1}. {plan}
                </span>
                {i < 2 && <span className="text-blue-400">›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <motion.button
        onClick={handleSave}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
          saved ? 'bg-green-500 text-white' : 'bg-[#1B2A4A] text-white hover:bg-[#243654]'
        }`}
      >
        {saved ? <><Check className="w-5 h-5" /> {t('prefSaved')}</> : <><Save className="w-5 h-5" /> {t('savePreferences')}</>}
      </motion.button>
    </div>
  );
}
