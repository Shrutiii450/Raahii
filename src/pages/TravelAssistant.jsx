import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Check } from 'lucide-react';

export default function TravelAssistant() {
  const { t, chatMessages, addChatMessage, generateAIResponse, chatLoading, setChatLoading } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [processingSteps, setProcessingSteps] = useState([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, processingSteps]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    addChatMessage({ role: 'user', text: userMsg });
    setChatLoading(true);

    const steps = [t('checkingFlight'), t('checkingConnection'), t('calculatingBuffer'), t('checkingRisk')];
    setProcessingSteps([]);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setProcessingSteps(prev => [...prev, steps[i]]);
    }

    await new Promise(r => setTimeout(r, 500));
    const response = generateAIResponse(userMsg);
    addChatMessage({ role: 'assistant', text: response });
    setProcessingSteps([]);
    setChatLoading(false);
  };

  const handleSuggestion = (q) => {
    setInput(q);
  };

  const suggestions = [t('sq1'), t('sq2'), t('sq3'), t('sq4'), t('sq5'), t('sq6')];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          💬 {t('aiTitle')}
        </h1>
        <p className="text-slate-500">{t('aiSub')}</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
        {chatMessages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('aiTitle')}</h3>
            <p className="text-slate-500 text-sm mb-8">{t('noMessages')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.slice(0, 4).map((q, i) => (
                <button key={i} onClick={() => handleSuggestion(q)}
                  className="text-sm bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full hover:border-teal-300 hover:text-teal-600 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-[#1B2A4A]' : 'bg-teal-500'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user' ? 'bg-[#1B2A4A] text-white' : 'bg-white border border-slate-200 text-slate-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Processing Steps */}
        {chatLoading && processingSteps.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <p className="text-sm text-slate-500 mb-2">{t('aiChecking')}</p>
                {processingSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm text-teal-600 mb-1">
                    <Check className="w-3 h-3" /> {step}
                  </motion.div>
                ))}
                {processingSteps.length < 4 && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" /> ...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {chatMessages.length > 0 && chatMessages.length < 4 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.slice(0, 3).map((q, i) => (
            <button key={i} onClick={() => handleSuggestion(q)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-teal-300 hover:text-teal-600 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-2 flex gap-2 focus-within:border-teal-400 transition-colors">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={t('aiPlaceholder')}
          disabled={chatLoading}
          className="flex-1 px-3 py-2 outline-none text-sm"
        />
        <button onClick={handleSend} disabled={chatLoading || !input.trim()}
          className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-200 text-white p-3 rounded-lg transition-colors">
          {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
