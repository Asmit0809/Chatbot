
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, ShieldCheck, Terminal, Newspaper, Zap, AlertCircle, PlusCircle } from 'lucide-react';
import { Message, Role } from './types';
import { ChatBubble } from './components/ChatBubble';
import { getGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { text: responseText, sources } = await getGeminiResponse(text, messages);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.BOT,
        content: responseText,
        timestamp: new Date(),
        sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.BOT,
        content: "I encountered a secure connection error. Let's try that again, I'm ready.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Start a new secure session? This will clear current logs.")) {
      setMessages([]);
    }
  };

  const triggerDailyUpdate = () => {
    handleSendMessage("Brief me! What's the 'must-know' security news from the last 24 hours?");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <ShieldCheck className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">CyberShield AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Link Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            title="Clear Session"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={triggerDailyUpdate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 text-sm font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20"
          >
            <Zap size={16} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Daily Intel</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-6 py-20 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
                <PlusCircle size={14} />
                New Secure Session
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                How can I help you <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">stay safe today?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <QuickAction 
                icon={<Newspaper className="text-blue-400" size={24} />}
                title="Intelligence Brief"
                description="What's happened in the last 24h?"
                onClick={triggerDailyUpdate}
              />
              <QuickAction 
                icon={<AlertCircle className="text-orange-400" size={24} />}
                title="Identify Scams"
                description="Analyze current fraud trends"
                onClick={() => handleSendMessage("What are the most dangerous phishing scams targeting users right now?")}
              />
              <QuickAction 
                icon={<Terminal className="text-emerald-400" size={24} />}
                title="Lockdown"
                description="Hardening security settings"
                onClick={() => handleSendMessage("Show me a 5-step checklist to secure my primary email account.")}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full px-4 py-8">
            {messages.map(msg => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex flex-row items-center">
                  <div className="bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-600/10">
                    <ShieldCheck className="text-white h-5 w-5" />
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-2xl flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-6 bg-gradient-to-t from-black to-transparent shrink-0">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#1a1b1e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden focus-within:border-blue-500/50 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="Ask Shieldy about a threat or say 'Hello'..."
              className="w-full bg-transparent py-5 pl-6 pr-16 focus:outline-none text-slate-200 placeholder:text-slate-600 font-medium"
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-3 px-2 flex justify-between items-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          <span>© 2024 CYBERSHIELD PROTOCOL</span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
            End-to-end Encrypted Session
          </span>
        </div>
      </footer>
    </div>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center p-6 bg-[#16171a] hover:bg-[#1e1f23] border border-slate-800 hover:border-blue-900/40 rounded-3xl transition-all text-center group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors"></div>
    <div className="mb-4 p-4 bg-slate-900 rounded-2xl group-hover:scale-110 group-hover:bg-black transition-all border border-slate-800 group-hover:border-blue-500/30 z-10 shadow-lg">
      {icon}
    </div>
    <h3 className="font-bold text-slate-100 text-sm mb-2 z-10">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed z-10">{description}</p>
  </button>
);

export default App;
