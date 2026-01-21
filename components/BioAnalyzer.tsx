
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { analyzeBio } from '../services/geminiService';
import { AnalysisResult, Language } from '../types';
import { translations } from '../translations';

interface Props {
  onAnalyze: () => boolean;
  credits: number;
  isPremium: boolean;
  lang: Language;
}

const BioAnalyzer: React.FC<Props> = ({ onAnalyze, credits, isPremium, lang }) => {
  const [bioText, setBioText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const t = translations[lang];

  const runAnalysis = async () => {
    if (!bioText.trim()) return;
    if (!onAnalyze()) {
        alert(t.outOfCredits);
        return;
    }

    setLoading(true);
    try {
      const data = await analyzeBio(bioText, lang);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert(lang === 'mg' ? "Tsy nahitana vokany." : "Impossible d'analyser la bio. L'IA a trop grincé des dents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Search className="text-blue-500" />
            {t.analyzeBio}
        </h2>
        <textarea 
          className="w-full h-32 bg-black border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          placeholder={t.pasteBio}
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
        />
        <button 
          onClick={runAnalysis}
          disabled={loading || !bioText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all"
        >
          {loading ? t.calculating : t.analyzeBio}
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">{t.riskScore}</span>
                <span className={`text-2xl font-black ${result.score > 60 ? 'text-red-500' : 'text-green-500'}`}>{result.score}/100</span>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">{t.sincerity}</span>
                <span className="text-2xl font-black text-blue-500">{result.sincerityScore}/100</span>
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
             <h3 className="font-bold text-white">{t.summary}</h3>
             <p className="text-sm text-zinc-400 italic leading-relaxed">"{result.summary}"</p>

             {result.cliches && result.cliches.length > 0 && (
                <div className="space-y-2">
                   <h4 className="text-xs font-bold text-zinc-500 uppercase">{t.clichesDetected}</h4>
                   <div className="flex flex-wrap gap-2">
                      {result.cliches.map((cliche, idx) => (
                        <span key={idx} className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-1 rounded-full border border-zinc-700">
                           {cliche}
                        </span>
                      ))}
                   </div>
                </div>
             )}

             {isPremium && result.suggestions && (
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl space-y-2">
                   <h4 className="text-xs font-bold text-purple-400 uppercase flex items-center gap-1">
                      <span className="animate-pulse"><Sparkles size={12}/></span> {t.oracleSuggestions}
                   </h4>
                   <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                      {result.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
                   </ul>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BioAnalyzer;
