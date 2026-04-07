import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot, Loader2, Trash2, Sparkles, Save, Check, Settings2, Zap, Search, FastForward, Eye, Palette, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generalChat } from '@/src/services/gemini';
import { saveToLibrary } from '@/src/lib/storage';
import ReactMarkdown from 'react-markdown';
import { Language, translations } from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  lang: Language;
}

export function Chat({ lang }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<'fast' | 'deepSearch' | 'preview' | 'creative' | 'technical'>('fast');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generalChat(input, mode);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'I am sorry, I could not process that request.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error: Failed to connect to AI service.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (msg: Message) => {
    saveToLibrary('chat', msg.content.substring(0, 30) + '...', msg.content);
    setSavedIds((prev) => new Set(prev).add(msg.id));
    setTimeout(() => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(msg.id);
        return next;
      });
    }, 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const modes = [
    { id: 'fast', label: t.fast, icon: FastForward, color: 'text-blue-400' },
    { id: 'deepSearch', label: t.deepSearch, icon: Search, color: 'text-amber-400' },
    { id: 'preview', label: t.preview, icon: Eye, color: 'text-emerald-400' },
    { id: 'creative', label: t.creative, icon: Palette, color: 'text-pink-400' },
    { id: 'technical', label: t.technical, icon: Terminal, color: 'text-indigo-400' }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-8 space-y-6 overflow-hidden">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20">
            <MessageSquare className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{t.chat}</h2>
            <p className="text-zinc-500 text-sm">Your general-purpose creative assistant.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-3 rounded-xl transition-all active:scale-95 border",
              showSettings ? "bg-indigo-600 border-indigo-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-100"
            )}
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <button
            onClick={clearChat}
            className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 rounded-xl transition-all active:scale-95"
            title={t.clear}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 flex flex-col shadow-2xl shadow-black/50 overflow-hidden relative">
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-zinc-800 mb-4 pb-4"
            >
              <div className="flex flex-wrap gap-2">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all",
                      mode === m.id ? "bg-indigo-600/10 border-indigo-600 text-indigo-400" : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <m.icon className={cn("w-4 h-4", mode === m.id ? m.color : "text-zinc-600")} />
                    {m.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 mb-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4"
              >
                <Sparkles className="w-16 h-16 opacity-20" />
                <p className="text-sm">Start a conversation with Nexus AI.</p>
              </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex gap-4 max-w-[85%] group",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                    msg.role === 'user' 
                      ? "bg-indigo-600 border-indigo-500 text-white" 
                      : "bg-zinc-800 border-zinc-700 text-indigo-400"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className={cn(
                      "p-4 rounded-2xl shadow-lg relative",
                      msg.role === 'user' 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-zinc-800/50 text-zinc-100 border border-zinc-700/50 rounded-tl-none"
                    )}>
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleSave(msg)}
                          className="absolute -right-10 top-0 p-2 text-zinc-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={t.save}
                        >
                          {savedIds.has(msg.id) ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    <p className={cn(
                      "text-[10px] mt-1 opacity-50",
                      msg.role === 'user' ? "text-right" : "text-left"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 mr-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-indigo-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-2xl rounded-tl-none border border-zinc-700/50 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-zinc-500 text-sm animate-pulse">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.prompt}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 pr-16 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all outline-none shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 top-2 bottom-2 px-4 rounded-xl flex items-center justify-center transition-all active:scale-95",
              !input.trim() || isLoading
                ? "bg-zinc-900 text-zinc-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
