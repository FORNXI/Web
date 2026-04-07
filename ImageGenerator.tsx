import React, { useState } from 'react';
import { ImageIcon, Sparkles, Download, Loader2, Save, Check, Settings2, Maximize2, Monitor, Square, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateImage } from '@/src/services/gemini';
import { saveToLibrary } from '@/src/lib/storage';
import { Language, translations } from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';

interface ImageGeneratorProps {
  lang: Language;
}

export function ImageGenerator({ lang }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [quality, setQuality] = useState('standard');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('realistic');

  const t = translations[lang];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setIsSaved(false);
    try {
      const result = await generateImage(prompt, quality, aspectRatio, style);
      setImageUrl(result || '');
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!imageUrl) return;
    saveToLibrary('image', prompt.substring(0, 30) + '...', imageUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `nexus-ai-image-${Date.now()}.png`;
    link.click();
  };

  const styles = [
    { id: 'realistic', label: 'Realistic' },
    { id: 'animated', label: 'Animated' },
    { id: 'cartoon', label: 'Cartoon' },
    { id: 'movie', label: 'Movie' },
    { id: 'cyberpunk', label: 'Cyberpunk' }
  ];

  const aspectRatios = [
    { id: '1:1', icon: Square, label: '1:1' },
    { id: '16:9', icon: Monitor, label: '16:9' },
    { id: '9:16', icon: Smartphone, label: '9:16' }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-8 space-y-6 overflow-y-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20">
            <ImageIcon className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{t.image}</h2>
            <p className="text-zinc-500 text-sm">Create stunning visuals from text prompts.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Input Section */}
        <section className="flex flex-col space-y-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Image Prompt</span>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  showSettings ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                )}
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.prompt}
              className="h-32 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 resize-none font-sans text-sm leading-relaxed"
            />

            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-zinc-800 pt-4 mt-4 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t.quality}</label>
                      <select 
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="w-full bg-zinc-800 border-zinc-700 rounded-xl text-xs text-zinc-200 focus:ring-indigo-500"
                      >
                        <option value="low">Low Quality</option>
                        <option value="standard">Standard</option>
                        <option value="4k">4K Ultra HD</option>
                        <option value="8k">8K Masterpiece</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t.aspectRatio}</label>
                      <div className="flex gap-2">
                        {aspectRatios.map((ratio) => (
                          <button
                            key={ratio.id}
                            onClick={() => setAspectRatio(ratio.id)}
                            className={cn(
                              "flex-1 p-2 rounded-lg border transition-all flex flex-col items-center gap-1",
                              aspectRatio === ratio.id ? "bg-indigo-600/10 border-indigo-600 text-indigo-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                            )}
                          >
                            <ratio.icon className="w-4 h-4" />
                            <span className="text-[10px]">{ratio.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t.style}</label>
                    <div className="flex flex-wrap gap-2">
                      {styles.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-medium border transition-all",
                            style === s.id ? "bg-indigo-600 border-indigo-600 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={cn(
                  "px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold",
                  isGenerating || !prompt.trim()
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
                )}
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isGenerating ? t.generating : t.generate}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4 tracking-tight">Quick Tips</h3>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>• Be specific about the style (e.g., "oil painting", "3D render", "minimalist").</li>
              <li>• Describe lighting and atmosphere (e.g., "golden hour", "dramatic shadows").</li>
              <li>• Mention the camera angle (e.g., "low angle", "wide shot").</li>
            </ul>
          </div>
        </section>

        {/* Preview Section */}
        <section className="flex flex-col space-y-4">
          <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col items-center justify-center relative shadow-2xl shadow-black/50 overflow-hidden group">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-zinc-500 text-sm animate-pulse">Painting your vision...</p>
                </motion.div>
              ) : imageUrl ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <img
                    src={imageUrl}
                    alt="Generated"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={handleSave}
                      className="p-3 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-xl backdrop-blur-md border border-zinc-800 transition-all active:scale-95"
                      title={t.save}
                    >
                      {isSaved ? <Check className="w-5 h-5 text-emerald-400" /> : <Save className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={downloadImage}
                      className="p-3 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-xl backdrop-blur-md border border-zinc-800 transition-all active:scale-95"
                      title={t.download}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 space-y-4">
                  <div className="w-24 h-24 bg-zinc-950 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-inner">
                    <ImageIcon className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-sm">Your creation will appear here.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
