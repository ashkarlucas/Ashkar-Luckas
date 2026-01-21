
import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Share2, EyeOff, RotateCcw, CheckCircle2, Flame } from 'lucide-react';
import { analyzeScreenshot } from '../services/geminiService';
import { AnalysisResult, Language } from '../types';
import { translations } from '../translations';

interface Props {
  onAnalyze: () => boolean;
  credits: number;
  isPremium: boolean;
  lang: Language;
}

const RedFlagDetector: React.FC<Props> = ({ onAnalyze, credits, isPremium, lang }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnonymized, setIsAnonymized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    if (!onAnalyze()) {
        alert(t.outOfCredits);
        return;
    }

    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeScreenshot(base64Data, lang);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert(lang === 'mg' ? "Nisy olana kely tamin'ny IA. Andramo indray." : "L'IA a eu un bug. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setIsAnonymized(false);
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-white">{lang === 'mg' ? 'Mpamantatra ny Marina' : 'Détecteur de Vérité'}</h2>
        <p className="text-zinc-400 text-sm">{lang === 'mg' ? "Hampiditra sary mba hahitana ny marina ao ambadika." : "Télécharge une capture d'écran d'un profil ou d'un chat pour voir ce qu'il se passe réellement."}</p>
        
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-700 rounded-xl py-12 flex flex-col items-center gap-3 cursor-pointer hover:border-red-500 transition-colors bg-black/40"
          >
            <Upload className="text-zinc-500" size={40} />
            <span className="text-zinc-500 font-medium">{t.selectScreenshot}</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
          </div>
        ) : (
          <div className="relative group">
            <img 
                src={image} 
                className={`w-full rounded-xl object-contain max-h-[400px] border border-zinc-700 transition-all ${isAnonymized ? 'blur-sensitive' : ''}`} 
            />
            {isAnonymized && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl text-center px-4">
                   <div className="bg-black/80 px-4 py-2 rounded-full text-[10px] font-bold text-white border border-white/20 uppercase">{t.anonymized}</div>
                </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={reset} className="bg-black/80 p-2 rounded-lg border border-zinc-700 text-white"><RotateCcw size={16}/></button>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {image && !result && (
            <button 
              disabled={loading}
              onClick={runAnalysis}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : t.unmask}
            </button>
          )}
        </div>
        
        {!isPremium && <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.credits} : {credits}/3 {t.daily}</div>}
      </div>

      {result && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
             <div className={`absolute top-0 right-0 p-4 font-heading font-black text-4xl opacity-10 ${result.score > 70 ? 'text-red-500' : 'text-green-500'}`}>
                {result.score}%
             </div>
             
             <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <AlertCircle className={result.score > 50 ? "text-red-500" : "text-green-500"} />
                {lang === 'mg' ? "Tatitra" : "Rapport d'Analyse"}
             </h3>
             
             <p className="text-zinc-300 text-sm italic mb-4">"{result.summary}"</p>

             <div className="space-y-3">
                {result.flags.map((flag, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex gap-3 ${
                    flag.severity === 'high' ? 'bg-red-500/10 border-red-500/30' : 
                    flag.severity === 'medium' ? 'bg-orange-500/10 border-orange-500/30' : 
                    'bg-zinc-800 border-zinc-700'
                  }`}>
                    <div className="pt-1">
                      {flag.severity === 'high' ? <Flame size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-zinc-400" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-200">{flag.category}</h4>
                      <p className="text-xs text-zinc-400">{flag.description}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex gap-3">
             <button 
                onClick={() => setIsAnonymized(!isAnonymized)}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all border ${isAnonymized ? 'bg-zinc-100 text-black border-white' : 'bg-transparent text-white border-zinc-700'}`}
             >
                <EyeOff size={18} />
                {isAnonymized ? t.readyToShare : t.blurNames}
             </button>
             <button className="bg-white text-black py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                <Share2 size={18} />
                {t.share}
             </button>
          </div>
          <p className="text-[10px] text-zinc-600 text-center uppercase tracking-wider">
            {t.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default RedFlagDetector;
