import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Maximize2, 
  Minimize2, 
  Trash2,
  Stethoscope,
  Check,
  Copy
} from 'lucide-react';
import { askAiQuestion } from '../services/api';
import MarkdownRenderer from './MarkdownRenderer';

export default function FloatingAiChatModal({ setActiveTab, setSelectedDoctorSpecialty }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: `### 🩺 VeraHealth AI Assistant
Hello! I can answer **any medical or health question** with verified clinical guidance in ChatGPT format. 

*Try asking: "What should I do for a sudden fever?", "Can I take paracetamol with milk?", or "How to soothe an itchy skin rash?"*`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (qText = null) => {
    const text = typeof qText === 'string' ? qText : inputQuestion;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await askAiQuestion(text.trim());
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        specialist: response.specialist,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `### ⚠️ Notice\nUnable to fetch medical response right now. Please try again.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button (Always visible on bottom-right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-linear-to-tr from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-xl shadow-sky-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group cursor-pointer border-2 border-white/40"
          title="Ask VeraHealth AI Question"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white"></span>
          </div>
          <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">
            Ask AI Doctor
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'w-[95vw] sm:w-[650px] h-[85vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[420px] h-[550px]'
          }`}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-sky-600 to-cyan-600 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">VeraHealth AI Assistant</h3>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 px-1.5 py-0.2 rounded-full font-semibold">
                    ChatGPT Engine
                  </span>
                </div>
                <p className="text-[11px] text-sky-100">Ask any medical question</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend('What should I do for a fever of 101F?')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 border border-slate-200 shrink-0 font-medium transition-colors"
            >
              🌡️ Fever 101°F
            </button>
            <button
              onClick={() => handleSend('Can I take paracetamol with ibuprofen?')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 border border-slate-200 shrink-0 font-medium transition-colors"
            >
              💊 Paracetamol + Ibuprofen
            </button>
            <button
              onClick={() => handleSend('How to treat an eye stye or swelling?')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 border border-slate-200 shrink-0 font-medium transition-colors"
            >
              👁️ Eye Swelling
            </button>
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <MarkdownRenderer content={msg.text} />
                    )}
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${
                        isUser ? 'text-sky-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-[85%]">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                <span className="text-[11px] text-slate-500 font-medium">Formulating clinical answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any health question..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

