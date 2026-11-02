import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Stethoscope, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  HelpCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { askAiQuestion } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function AiChatAssistantView({ setActiveTab, setSelectedDoctorSpecialty }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `### 🩺 Welcome to VeraHealth Clinical AI Assistant
I am your **AI Clinical Health Assistant**, trained to provide accurate, evidence-based answers to any medical, health, medication, or symptom questions formatted with clinical clarity.

---

### 💡 What you can ask me:
- **Symptoms & Triage**: *"I have a fever of 101°F, sore throat, and headache for 2 days. What should I do?"*
- **Medications & Safety**: *"Can I safely take paracetamol with ibuprofen?"*
- **Diet & Nutrition**: *"What diet is best for lowering cholesterol and triglycerides?"*
- **First Aid & Acute Care**: *"How should I treat a minor kitchen steam burn?"*
- **Condition Explanations**: *"What is GERD / acid reflux and how can I prevent it?"*

> **Notice:** I provide clinical decision support and educational insights. For acute emergencies (severe chest pain, stroke symptoms, difficulty breathing), please call **112 / 108** immediately.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sampleQuestions = [
    { label: 'Fever & Sore Throat', q: 'I have a fever of 101F, sore throat, and mild headache since yesterday. What should I do?' },
    { label: 'Paracetamol + Ibuprofen', q: 'Can I take paracetamol with ibuprofen together for pain?' },
    { label: 'Eye Swelling', q: 'My upper eyelid is swollen, red, and tender to touch like a stye. How to treat it?' },
    { label: 'Acidity / GERD', q: 'Burning feeling in my chest and throat after meals. What foods should I avoid?' },
    { label: 'Lower Back Pain', q: 'Sharp lower back pain after lifting something heavy yesterday. What is the best recovery protocol?' },
    { label: 'Lowering Cholesterol', q: 'What is the most effective evidence-based diet to lower high LDL cholesterol?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText = null) => {
    const textToSend = typeof questionText === 'string' ? questionText : inputQuestion;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      // Build conversation history
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await askAiQuestion(textToSend.trim(), history);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        specialist: response.specialist,
        urgency: response.urgency,
        riskLevel: response.riskLevel,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `### ⚠️ Connection Notice\nUnable to retrieve remote response at this moment. Please check your network or try again.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConsultSpecialist = (specialist) => {
    if (setSelectedDoctorSpecialty) {
      const specLower = (specialist || '').toLowerCase();
      if (specLower.includes('derma')) setSelectedDoctorSpecialty('dermatology');
      else if (specLower.includes('cardio')) setSelectedDoctorSpecialty('cardiology');
      else if (specLower.includes('neuro')) setSelectedDoctorSpecialty('neurology');
      else if (specLower.includes('ortho')) setSelectedDoctorSpecialty('orthopedics');
      else if (specLower.includes('ophthal')) setSelectedDoctorSpecialty('ophthalmology');
      else if (specLower.includes('pulmon')) setSelectedDoctorSpecialty('pulmonology');
      else if (specLower.includes('dent')) setSelectedDoctorSpecialty('dentistry');
      else setSelectedDoctorSpecialty('all');
    }
    setActiveTab('doctors');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `### 🩺 Conversation Reset\nAsk any new medical or health question whenever you're ready!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-2xs">
              ChatGPT Clinical Engine
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Evidence-Based Triage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Ask Vera AI Medical Doctor</span>
            <Sparkles className="w-6 h-6 text-sky-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Get instant, correct answers formatted in clear clinical Markdown with direct answers, probable causes, home care, and red flag warnings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('screening')}
            className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors flex items-center gap-1.5 border border-sky-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>8-System Screener</span>
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          Suggested Clinical Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq.q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-medium transition-all border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Sparkles className="w-3 h-3 text-sky-500 shrink-0" />
              <span>{sq.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                {/* Message Body */}
                <div
                  className={`max-w-[90%] sm:max-w-[82%] rounded-3xl p-5 sm:p-6 ${
                    isUser
                      ? 'bg-linear-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-500/15 rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 shadow-xs rounded-tl-xs'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10 sm:border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>
                        {isUser ? 'You' : 'VeraHealth Clinical AI'}
                      </span>
                      {!isUser && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold border border-sky-200">
                          Verified Medical Format
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${isUser ? 'text-sky-100' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>

                  {/* Content */}
                  {isUser ? (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <MarkdownRenderer content={msg.text} />

                      {/* Specialist Recommendation Pill & Actions if present */}
                      {msg.specialist && (
                        <div className="pt-3 mt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                            <Stethoscope className="w-4 h-4 text-sky-600" />
                            <span>Recommended Specialist:</span>
                            <span className="font-bold text-sky-800">{msg.specialist}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Copy Answer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleConsultSpecialist(msg.specialist)}
                              className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                            >
                              <span>Book Doctor</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 justify-start">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
                <Bot className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-3xl rounded-tl-xs p-5 shadow-xs flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-bounce"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  VeraHealth AI is analyzing symptoms and formulating clinical response...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any medical, symptom, or medication question... (Press Enter to send)"
              className="flex-1 text-xs sm:text-sm px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none shadow-2xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="p-3.5 sm:px-5 sm:py-3.5 bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 disabled:opacity-40 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Clinical AI generates evidence-based guidance in ChatGPT format.</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>

      </div>

    </div>
  );
}

