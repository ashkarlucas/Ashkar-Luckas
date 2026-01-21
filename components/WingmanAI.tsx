
import React, { useState } from 'react';
import { Sparkles, MessageSquare, Copy, RefreshCw, Upload } from 'lucide-react';
import { getWingmanAdvice } from '../services/geminiService';
import { WingmanResponse, Language } from '../types';
import { translations } from '../translations';

interface Props {
  onAnalyze: () => boolean;
  credits: number;
  isPremium: boolean;
  lang: Language;
}

const WingmanAI: React.FC<Props> = ({ onAnalyze, credits, isPremium, lang }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<WingmanResponse | null>(null);
  const t = translations[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateResponses = async () => {
    if (!image) return;
    if (!onAnalyze()) {
        alert(t.outOfCredits);
        return;
    }

    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const data = await getWingmanAdvice(base64Data, lang);
      setResponses(data);
    } catch (error) {
      console.error(error);
      alert(lang === 'mg' ? "Olana tamin'ny famokarana valiny." : "Le Wingman est occupé. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(lang === 'mg' ? "Voadika!" : "Copié dans le presse-papier !");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="text-purple-500" />
            Wingman IA
        </h2>
        <p className="text-zinc-400 text-sm italic">"{t.wingmanSub}"</p>

        {!image ? (
          <label className="border-2 border-dashed border-zinc-700 rounded-xl py-12 flex flex-col items-center gap-3 cursor-pointer bg-black/40">
            <MessageSquare className="text-zinc-500" size={40} />
            <span className="text-zinc-500 font-medium text-sm">{t.uploadChat}</span>
            <input type="file" onChange={handleFileChange} hidden accept="image/*" />
          </label>
        ) : (
          <div className="relative">
             <img src={image} className="w-full rounded-xl opacity-40 border border-zinc-800 max-h-48 object-cover" />
             <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={generateResponses}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all"
                >
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {t.generateResponses}
                </button>
             </div>
          </div>
        )}
      </div>

      {responses && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4">
          <ResponseCard 
            title={t.funny} 
            text={responses.funny} 
            icon="😄" 
            onCopy={() => copyToClipboard(responses.funny)} 
          />
          <ResponseCard 
            title={t.mysterious} 
            text={responses.mysterious} 
            icon="🕵️" 
            onCopy={() => copyToClipboard(responses.mysterious)} 
          />
          <ResponseCard 
            title={t.direct} 
            text={responses.direct} 
            icon="🎯" 
            onCopy={() => copyToClipboard(responses.direct)} 
          />
        </div>
      )}
    </div>
  );
};

const ResponseCard = ({ title, text, icon, onCopy }: { title: string, text: string, icon: string, onCopy: () => void }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
        {icon} {title}
      </span>
      <button onClick={onCopy} className="text-zinc-400 hover:text-white transition-colors">
        <Copy size={16} />
      </button>
    </div>
    <p className="text-zinc-100 text-sm leading-relaxed">{text}</p>
  </div>
);

export default WingmanAI;
