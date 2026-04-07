import React, { useState } from 'react';
import { Send, Copy, Check, Terminal, Code2, Sparkles, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateCode } from '@/src/services/gemini';
import { saveToLibrary } from '@/src/lib/storage';
import ReactMarkdown from 'react-markdown';
import { Language, translations } from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';

interface CodeAssistantProps {
  lang: Language;
}

export function CodeAssistant({ lang }: CodeAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const t = translations[lang];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setIsSaved(false);
    try {
      const result = await generateCode(prompt);
      setResponse(result || '');
    } catch (error) {
      console.error('Error generating code:', error);
      setResponse('Failed to generate code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!response) return;
    saveToLibrary('code', prompt.substring(0, 30) + '...', response);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-8 space-y-6 overflow-y-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20">
            <Code2 className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{t.code}</h2>
            <p className="text-zinc-500 text-sm">Generate, explain, and optimize code with AI.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Input Section */}
        <section className="flex flex-col space-y-4">
          <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-semibold uppercase tracking-widest">
              <Terminal className="w-4 h-4" />
              <span>Prompt Input</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.prompt}
              className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 resize-none font-mono text-sm leading-relaxed"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className={cn(
                  "px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold",
                  isLoading || !prompt.trim()
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isLoading ? t.generating : t.generate}
              </button>
            </div>
          </div>
        </section>

        {/* Output Section */}
        <section className="flex flex-col space-y-4">
          <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col relative shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                <Send className="w-4 h-4" />
                <span>AI Response</span>
              </div>
              <div className="flex gap-2">
                {response && (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-indigo-400"
                      title={t.save}
                    >
                      {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
                      title={t.copy}
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full space-y-4"
                  >
                    <div className="w-12 h-12 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-zinc-500 text-sm animate-pulse">Consulting the AI core...</p>
                  </motion.div>
                ) : response ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-invert prose-sm max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-code:text-indigo-400"
                  >
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
                    <Code2 className="w-16 h-16 opacity-20" />
                    <p className="text-sm">Response will appear here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
