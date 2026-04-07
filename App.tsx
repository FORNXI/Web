import React, { useState } from 'react';
import { Sidebar, View } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CodeAssistant } from './components/CodeAssistant';
import { ImageGenerator } from './components/ImageGenerator';
import { Chat } from './components/Chat';
import { Expert } from './components/Expert';
import { Utilities } from './components/Utilities';
import { Library } from './components/Library';
import { Settings } from './components/Settings';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from './lib/i18n';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [lang, setLang] = useState<Language>('es');
  const [theme, setTheme] = useState('dark');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} lang={lang} />;
      case 'code':
        return <CodeAssistant lang={lang} />;
      case 'image':
        return <ImageGenerator lang={lang} />;
      case 'chat':
        return <Chat lang={lang} />;
      case 'expert':
        return <Expert lang={lang} />;
      case 'utilities':
        return <Utilities lang={lang} />;
      case 'library':
        return <Library lang={lang} />;
      case 'settings':
        return (
          <Settings 
            lang={lang} 
            onLangChange={setLang} 
            theme={theme} 
            onThemeChange={handleThemeChange} 
          />
        );
      default:
        return <Dashboard onViewChange={setCurrentView} lang={lang} />;
    }
  };

  return (
    <div className="flex h-screen bg-theme-bg text-theme-text font-sans selection:bg-theme-primary/30 selection:text-theme-primary transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        lang={lang} 
      />
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + lang}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
