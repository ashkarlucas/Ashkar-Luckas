
import React from 'react';
import { Heart, MessageCircle, MoreHorizontal, TrendingUp } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
}

const Community: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];

  const MOCK_POSTS = lang === 'fr' ? [
    {
      id: '1',
      title: "Le Narcissique de Hinge",
      risk: 85,
      summary: "Utilise 4 fois 'Moi' dans la première phrase. Probabilité de ghosting : 99%.",
      likes: 124,
      comments: 18,
      category: 'Red Flags'
    },
    {
      id: '2',
      title: "La Bio 'Traveler' Ultime",
      risk: 42,
      summary: "A mentionné Bali, le vin et son chien. Score de clichés : Infini.",
      likes: 88,
      comments: 5,
      category: 'Clichés'
    },
    {
      id: '3',
      title: "Sauvetage Wingman",
      risk: 12,
      summary: "Réponse mystérieuse générée. Elle a répondu en 2 minutes !",
      likes: 215,
      comments: 42,
      category: 'Succès'
    }
  ] : [
    {
      id: '1',
      title: "Ilay narcissique ao amin'ny Hinge",
      risk: 85,
      summary: "Niteny hoe 'Izaho' im-pito tamin'ny resaka voalohany. Handeha handositra izy.",
      likes: 124,
      comments: 18,
      category: 'Red Flags'
    },
    {
      id: '2',
      title: "Ilay mpivahiny be bio",
      risk: 42,
      summary: "Niteny Bali sy divay foana. Bio mahazatra loatra.",
      likes: 88,
      comments: 5,
      category: 'Clichés'
    },
    {
      id: '3',
      title: "Wingman nahomby",
      risk: 12,
      summary: "Nahazo valiny haingana be tamin'ny torohevitry ny Wingman.",
      likes: 215,
      comments: 42,
      category: 'Fahombiazana'
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-2xl font-heading font-bold text-white">{lang === 'mg' ? 'Vaovao' : 'Fil de la Vérité'}</h2>
         <div className="bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <TrendingUp size={12} /> {t.popular}
         </div>
      </div>

      {MOCK_POSTS.map(post => (
        <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
           <div className="p-4 flex justify-between items-start border-b border-zinc-800/50">
              <div>
                 <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    post.category === 'Red Flags' ? 'bg-red-500/20 text-red-500' :
                    post.category.includes('Succès') || post.category.includes('Fahombiazana') ? 'bg-green-500/20 text-green-500' :
                    'bg-blue-500/20 text-blue-500'
                 }`}>{post.category}</span>
                 <h3 className="text-md font-bold text-white mt-1">{post.title}</h3>
              </div>
              <MoreHorizontal className="text-zinc-600 cursor-pointer" />
           </div>
           
           <div className="p-4 bg-black/40 space-y-2">
              <div className="flex items-center gap-3">
                 <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-xs shrink-0 ${post.risk > 70 ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                    {post.risk}%
                 </div>
                 <p className="text-sm text-zinc-400 line-clamp-2 italic leading-snug">"{post.summary}"</p>
              </div>
           </div>

           <div className="p-4 flex gap-4 text-zinc-500">
              <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                 <Heart size={18} />
                 <span className="text-xs font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                 <MessageCircle size={18} />
                 <span className="text-xs font-bold">{post.comments}</span>
              </button>
           </div>
        </div>
      ))}

      <div className="pt-8 pb-4 text-center">
         <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">{t.feedSub}</p>
      </div>
    </div>
  );
};

export default Community;
