import React from 'react';
import { Settings as SettingsIcon, Globe, Palette, Shield, Cpu, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, translations } from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';

interface SettingsProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

export function Settings({ lang, onLangChange, theme, onThemeChange }: SettingsProps) {
  const t = translations[lang];

  const languages: { id: Language; label: string }[] = [
    { id: 'es', label: 'Español' },
    { id: 'en', label: 'English' },
    { id: 'pt', label: 'Português' },
    { id: 'fr', label: 'Français' },
    { id: 'de', label: 'Deutsch' },
    { id: 'it', label: 'Italiano' },
    { id: 'ja', label: '日本語' },
    { id: 'ko', label: '한국어' },
    { id: 'zh', label: '中文' },
    { id: 'ru', label: 'Русский' }
  ];

  const themes = [
    { id: 'dark', label: t.dark, color: 'bg-zinc-900' },
    { id: 'light', label: t.light, color: 'bg-zinc-100' },
    { id: 'gradient', label: t.gradient, color: 'bg-gradient-to-br from-indigo-900 to-purple-900' },
    { id: 'aquatic', label: t.aquatic, color: 'bg-sky-900' },
    { id: 'midnight', label: t.midnight, color: 'bg-slate-950' },
    { id: 'forest', label: t.forest, color: 'bg-emerald-900' },
    { id: 'sunset', label: t.sunset, color: 'bg-rose-900' },
    { id: 'cyber', label: t.cyber, color: 'bg-black border border-green-500' },
    { id: 'minimal', label: t.minimal, color: 'bg-white border border-zinc-200' },
    { id: 'royal', label: t.royal, color: 'bg-indigo-950 border border-amber-500' }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-8 space-y-8 overflow-y-auto">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700">
          <SettingsIcon className="text-zinc-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{t.settings}</h2>
          <p className="text-zinc-500 text-sm">Personalize your Nexus AI experience.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Language Settings */}
        <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 text-zinc-100 font-bold tracking-tight">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3>{t.language}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => onLangChange(l.id)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all border flex items-center justify-between",
                  lang === l.id 
                    ? "bg-indigo-600/10 border-indigo-600 text-indigo-400" 
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                )}
              >
                {l.label}
                {lang === l.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </section>

        {/* Theme Settings */}
        <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 text-zinc-100 font-bold tracking-tight">
            <Palette className="w-5 h-5 text-violet-400" />
            <h3>{t.themes}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => onThemeChange(th.id)}
                className={cn(
                  "group relative p-4 rounded-2xl border transition-all flex flex-col gap-3 items-center text-center",
                  theme === th.id 
                    ? "bg-zinc-950 border-violet-600 shadow-lg shadow-violet-600/10" 
                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className={cn("w-full h-12 rounded-lg shadow-inner", th.color)} />
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  theme === th.id ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"
                )}>
                  {th.label}
                </span>
                {theme === th.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Security & API */}
        <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 text-zinc-100 font-bold tracking-tight">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3>Security & API</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gemini API Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-10 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center px-4 text-zinc-500 text-xs font-mono">
                  ••••••••••••••••••••••••••••••
                </div>
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors">
                  Edit
                </button>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              Your API key is stored securely in your environment variables. Never share your key with anyone.
            </p>
          </div>
        </section>

        {/* System Info */}
        <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 text-zinc-100 font-bold tracking-tight">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3>System Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400">Model Optimization</span>
              <span className="text-xs font-bold text-emerald-400">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400">Response Latency</span>
              <span className="text-xs font-bold text-amber-400">~240ms</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400">Grounding Engine</span>
              <span className="text-xs font-bold text-indigo-400">Google Search</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
