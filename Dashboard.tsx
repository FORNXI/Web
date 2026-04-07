import React from 'react';
import { Code2, Image as ImageIcon, MessageSquare, Zap, Activity, Users, Clock, ArrowUpRight, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';
import { View } from './Sidebar';
import { Language, translations } from '@/src/lib/i18n';

interface DashboardProps {
  onViewChange: (view: View) => void;
  lang: Language;
}

export function Dashboard({ onViewChange, lang }: DashboardProps) {
  const t = translations[lang];

  const stats = [
    { label: 'AI Generations', value: '1,284', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Active Users', value: '42', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Avg. Latency', value: '1.2s', icon: Clock, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  const quickActions = [
    { id: 'code', label: t.code, description: 'Create components, functions, or scripts.', icon: Code2, color: 'bg-indigo-600' },
    { id: 'image', label: t.image, description: 'Generate high-quality images from text.', icon: ImageIcon, color: 'bg-violet-600' },
    { id: 'expert', label: t.expert, description: 'Deep analytical reasoning and knowledge.', icon: BrainCircuit, color: 'bg-amber-600' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-theme-bg p-8 space-y-10 overflow-y-auto custom-scrollbar transition-colors duration-300">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold text-theme-text tracking-tight">{t.welcome}</h2>
        <p className="text-theme-text-muted text-lg">{t.subtitle}</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-theme-card border border-theme-border p-6 rounded-2xl shadow-xl shadow-black/20 hover:border-theme-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-theme-text-muted" />
              </div>
              <p className="text-theme-text-muted text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-theme-text mt-1">{stat.value}</h3>
            </motion.div>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-theme-text tracking-tight">{t.quickActions}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={() => onViewChange(action.id as View)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group relative bg-theme-card border border-theme-border p-8 rounded-3xl text-left hover:border-theme-primary transition-all duration-300 shadow-xl shadow-black/20 overflow-hidden active:scale-95"
              >
                <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-theme-text mb-2">{action.label}</h4>
                <p className="text-theme-text-muted text-sm leading-relaxed">{action.description}</p>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors" />
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Recent Activity / System Status */}
      <section className="bg-theme-card border border-theme-border rounded-3xl p-8 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold text-theme-text tracking-tight">{t.systemLogs}</h3>
          <span className="text-xs font-bold text-theme-primary uppercase tracking-widest bg-theme-primary/10 px-3 py-1 rounded-full">Real-time</span>
        </div>
        <div className="space-y-4 font-mono text-sm">
          {[
            { time: '10:32:15', msg: 'Neural engine initialized successfully.', status: 'success' },
            { time: '10:32:12', msg: 'Connecting to Gemini-3.1-Pro-Preview...', status: 'info' },
            { time: '10:32:10', msg: 'Loading image generation weights...', status: 'info' },
            { time: '10:32:08', msg: 'Nexus Core v2.4.0 started.', status: 'success' },
          ].map((log, i) => (
            <div key={i} className="flex gap-4 text-theme-text-muted">
              <span className="text-theme-text-muted opacity-50">[{log.time}]</span>
              <span className={log.status === 'success' ? 'text-emerald-500/80' : 'text-theme-primary/80'}>{log.msg}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
