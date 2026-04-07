import React, { useState, useEffect } from 'react';
import { Library as LibraryIcon, Trash2, ExternalLink, Code2, ImageIcon, MessageSquare, BrainCircuit, Search, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLibraryItems, removeFromLibrary, SavedItem } from '@/src/lib/storage';
import { Language, translations } from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';

interface LibraryProps {
  lang: Language;
}

export function Library({ lang }: LibraryProps) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [filter, setFilter] = useState<string>('');
  const t = translations[lang];

  useEffect(() => {
    setItems(getLibraryItems());
  }, []);

  const handleDelete = (id: string) => {
    removeFromLibrary(id);
    setItems(getLibraryItems());
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.content.toLowerCase().includes(filter.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-violet-400" />;
      case 'chat': return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'expert': return <BrainCircuit className="w-5 h-5 text-amber-400" />;
      default: return <LibraryIcon className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-8 space-y-8 overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20">
            <LibraryIcon className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{t.library}</h2>
            <p className="text-zinc-500 text-sm">Manage your saved AI creations and history.</p>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search library..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col space-y-4 hover:border-zinc-700 transition-colors group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="text-zinc-100 font-semibold line-clamp-1">{item.title}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  {item.type === 'image' ? (
                    <img 
                      src={item.content} 
                      alt={item.title} 
                      className="w-full h-32 object-cover rounded-xl border border-zinc-800"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <p className="text-zinc-400 text-sm line-clamp-3 font-mono bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                      {item.content}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.type}</span>
                  <button className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    View Details
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-600 space-y-4">
              <LibraryIcon className="w-16 h-16 opacity-10" />
              <p className="text-sm">No items found in your library.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
