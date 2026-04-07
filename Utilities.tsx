import React, { useState } from 'react';
import { Wrench, FileText, Languages, Loader2, Copy, Save, Check, SpellCheck, Code, ArrowRightLeft, Key, Volume2, Braces, SearchCode, Type, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  summarizeText, 
  translateText, 
  checkGrammar, 
  formatCode, 
  convertUnits, 
  generatePassword, 
  textToSpeechHint, 
  validateJson, 
  testRegex, 
  generateLorem 
} from '@/src/services/gemini';
import { saveToLibrary } from '@/src/lib/storage';
import { Language, translations } from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';

interface UtilitiesProps {
  lang: Language;
}

type UtilityTool = 
  | 'summarize' 
  | 'translate' 
  | 'grammar' 
  | 'format' 
  | 'units' 
  | 'password' 
  | 'tts' 
  | 'json' 
  | 'regex' 
  | 'lorem';

export function Utilities({ lang }: UtilitiesProps) {
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState(''); // For regex tester
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTool, setActiveTool] = useState<UtilityTool>('summarize');
  const [targetLang, setTargetLang] = useState('English');
  const t = translations[lang];

  const handleAction = async () => {
    if (activeTool !== 'password' && activeTool !== 'lorem' && !inputText.trim()) return;
    if (isLoading) return;
    
    setIsLoading(true);
    setIsSaved(false);
    try {
      let result = '';
      switch (activeTool) {
        case 'summarize': result = await summarizeText(inputText) || ''; break;
        case 'translate': result = await translateText(inputText, targetLang) || ''; break;
        case 'grammar': result = await checkGrammar(inputText) || ''; break;
        case 'format': result = await formatCode(inputText) || ''; break;
        case 'units': result = await convertUnits(inputText) || ''; break;
        case 'password': result = await generatePassword(parseInt(inputText) || 16) || ''; break;
        case 'tts': result = await textToSpeechHint(inputText) || ''; break;
        case 'json': result = await validateJson(inputText) || ''; break;
        case 'regex': result = await testRegex(inputText, inputText2) || ''; break;
        case 'lorem': result = await generateLorem(parseInt(inputText) || 3) || ''; break;
      }
      setOutput(result);
    } catch (error) {
      console.error('Utility error:', error);
      alert('Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleSave = () => {
    if (!output) return;
    saveToLibrary('chat', `${activeTool}: ${inputText.substring(0, 20)}...`, output);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const tools = [
    { id: 'summarize', label: t.summarize, icon: FileText },
    { id: 'translate', label: t.translate, icon: Languages },
    { id: 'grammar', label: t.grammarCheck, icon: SpellCheck },
    { id: 'format', label: t.codeFormatter, icon: Code },
    { id: 'units', label: t.unitConverter, icon: ArrowRightLeft },
    { id: 'password', label: t.passwordGen, icon: Key },
    { id: 'tts', label: t.textToSpeech, icon: Volume2 },
    { id: 'json', label: t.jsonValidator, icon: Braces },
    { id: 'regex', label: t.regexTester, icon: SearchCode },
    { id: 'lorem', label: t.loremIpsum, icon: Type }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-8 space-y-6 overflow-y-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center border border-amber-600/20">
            <Wrench className="text-amber-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{t.utilities}</h2>
            <p className="text-zinc-500 text-sm">10 powerful text processing tools at your fingertips.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Sidebar Tools */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Select Tool</h3>
          <div className="grid grid-cols-1 gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id as UtilityTool);
                  setOutput('');
                  setInputText('');
                  setInputText2('');
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                  activeTool === tool.id 
                    ? "bg-amber-600/10 border-amber-600/50 text-amber-400 shadow-lg shadow-amber-600/10" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                )}
              >
                <tool.icon className="w-4 h-4" />
                {tool.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input/Output Section */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col shadow-2xl shadow-black/50">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
              {activeTool === 'password' ? 'Password Length' : activeTool === 'lorem' ? 'Paragraph Count' : t.inputText}
            </label>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={activeTool === 'password' ? '16' : activeTool === 'lorem' ? '3' : t.prompt}
              className={cn(
                "bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 resize-none font-sans text-sm leading-relaxed",
                activeTool === 'password' || activeTool === 'lorem' ? "h-12" : "h-48"
              )}
            />

            {activeTool === 'regex' && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <label className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2 block">Test Text</label>
                <textarea
                  value={inputText2}
                  onChange={(e) => setInputText2(e.target.value)}
                  placeholder="Enter text to test the regex against..."
                  className="w-full h-24 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 resize-none font-sans text-sm leading-relaxed"
                />
              </div>
            )}
            
            {activeTool === 'translate' && (
              <div className="mt-4 flex items-center gap-4 pt-4 border-t border-zinc-800">
                <span className="text-xs text-zinc-500 font-medium">{t.targetLanguage}:</span>
                <input
                  type="text"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAction}
                disabled={isLoading || (activeTool !== 'password' && activeTool !== 'lorem' && !inputText.trim())}
                className={cn(
                  "px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold",
                  isLoading || (activeTool !== 'password' && activeTool !== 'lorem' && !inputText.trim())
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 active:scale-95"
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

          {/* Output Area */}
          <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col shadow-2xl shadow-black/50 relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Result</span>
              {output && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 rounded-lg transition-colors"
                    title={t.copy}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 rounded-lg transition-colors"
                    title={t.save}
                  >
                    {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center space-y-4"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    <p className="text-zinc-500 text-sm animate-pulse">Processing...</p>
                  </motion.div>
                ) : output ? (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-zinc-950/50 p-4 rounded-xl border border-zinc-800"
                  >
                    {output}
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                    <Wrench className="w-12 h-12 opacity-10" />
                    <p className="text-sm">Results will appear here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
