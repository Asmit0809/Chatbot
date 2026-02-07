
import React from 'react';
import { Role, Message } from '../types';
import { Shield, User, ExternalLink, Search, MessageSquare } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.role === Role.BOT;

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${isBot ? 'bg-blue-600 mr-3' : 'bg-slate-700 ml-3'}`}>
          {isBot ? <Shield className="text-white h-5 w-5" /> : <User className="text-white h-5 w-5" />}
        </div>
        
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div className={`px-5 py-5 rounded-2xl text-sm leading-relaxed shadow-2xl border transition-all ${
            isBot 
              ? 'bg-slate-900 text-slate-100 rounded-tl-none border-slate-800' 
              : 'bg-blue-600 text-white rounded-tr-none border-blue-500'
          }`}>
            <div className="space-y-4">
              {message.content.split('\n').map((line, i) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return null;

                const isAssessment = line.includes("Shieldy's Assessment:");
                const isHeader = line.match(/^\d+\./);
                const isSubHeader = line.includes('How it happened:') || line.includes('How to prevent from it:');
                const isIntelligenceReport = line.includes("The Intelligence Report:");
                const isSourcesHeader = line.startsWith('Sources:');

                if (isAssessment) {
                  return (
                    <div key={i} className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mb-2">
                      <p className="font-bold text-blue-400 flex items-center gap-2 mb-1 uppercase text-[10px] tracking-widest">
                        <Search size={12} />
                        Strategic Analysis
                      </p>
                      <p className="text-slate-200 leading-relaxed">
                        {line.replace("Shieldy's Assessment:", "").trim()}
                      </p>
                    </div>
                  );
                }

                if (isIntelligenceReport) {
                  return (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-slate-800">
                      <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-500">{line}</h3>
                    </div>
                  );
                }

                if (isHeader) {
                  return (
                    <div key={i} className="pt-4 first:pt-0">
                      <p className="font-bold text-blue-400 text-base flex items-start gap-2">
                        <span className="bg-blue-600/20 text-blue-400 px-2 rounded font-mono text-xs mt-1">{line.split('.')[0]}</span>
                        {line.split('.').slice(1).join('.').trim()}
                      </p>
                    </div>
                  );
                }

                if (isSubHeader) {
                  return (
                    <p key={i} className="font-semibold text-slate-200 pl-4 border-l-2 border-slate-700 mt-2 text-[13px]">
                      {line}
                    </p>
                  );
                }

                if (isSourcesHeader) return null; // We handle sources separately below

                return (
                  <p key={i} className="text-slate-300">
                    {line}
                  </p>
                );
              })}
            </div>

            {isBot && message.sources && message.sources.length > 0 && (
              <div className="mt-8 pt-4 border-t border-slate-800">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-3 flex items-center gap-2">
                  <ExternalLink size={10} />
                  Intelligence Sources
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-3 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-blue-400 rounded-lg text-[11px] transition-all border border-slate-800 group"
                    >
                      <span className="truncate flex-1">{source.title}</span>
                      <ExternalLink size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <span className="mt-2 text-[10px] text-slate-600 font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
            <MessageSquare size={10} />
            {isBot ? 'SECURE_CHANNEL // VERIFIED' : 'USER_CHANNEL // ENCRYPTED'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
