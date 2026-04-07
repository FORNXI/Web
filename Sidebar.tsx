import React from 'react';
import { Code2, Image as ImageIcon, MessageSquare, Settings, LayoutDashboard, Terminal, BrainCircuit, Library, Globe, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Language, translations } from '@/src/lib/i18n';

export type View = 'dashboard' | 'code' | 'image' | 'chat' | 'expert' | 'utilities' | 'library' | 'settings';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  lang: Language;
}

export function Sidebar({ currentView, onViewChange, lang }: SidebarProps) {
  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'code', label: t.code, icon: Code2 },
    { id: 'image', label: t.image, icon: ImageIcon },
    { id: 'chat', label: t.chat, icon: MessageSquare },
    { id: 'expert', label: t.expert, icon: BrainCircuit },
    { id: 'utilities', label: t.utilities, icon: Wrench },
    { id: 'library', label: t.library, icon: Library },
    { id: 'settings', label: t.settings, icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-theme-sidebar border-r border-theme-border flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-theme-border">
        <div className="w-8 h-8 bg-theme-primary rounded-lg flex items-center justify-center">
          <Terminal className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-theme-text tracking-tight">Nexus AI</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-theme-primary/10 text-theme-primary border border-theme-primary/20" 
                  : "text-theme-text-muted hover:text-theme-text hover:bg-theme-card border border-transparent"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-theme-primary" : "text-theme-text-muted group-hover:text-theme-text")} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-theme-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-theme-border space-y-4">
        <div className="bg-theme-card p-4 rounded-xl border border-theme-border">
          <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest mb-1">{t.status}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-theme-text-muted">{t.online}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
