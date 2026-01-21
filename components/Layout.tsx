
import React from 'react';
import { Shield, Sparkles, User, Info, Flame, Languages } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPremium: boolean;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isPremium, lang, setLang }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-md mx-auto relative border-x border-zinc-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={() => setActiveTab('RED_FLAGS')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-red-600 to-orange-400 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            TruthLayer
          </h1>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setLang(lang === 'fr' ? 'mg' : 'fr')}
             className="text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-md text-[10px] border border-zinc-800"
           >
              <Languages size={14} />
              {lang.toUpperCase()}
           </button>
           {!isPremium && (
             <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
                {t.oracle}
             </button>
           )}
           <User className="text-zinc-400 w-6 h-6" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-zinc-800 p-2 flex justify-around items-center">
        <NavItem 
          icon={<Shield size={22} />} 
          label={t.detector} 
          active={activeTab === 'RED_FLAGS'} 
          onClick={() => setActiveTab('RED_FLAGS')} 
        />
        <NavItem 
          icon={<Sparkles size={22} />} 
          label={t.wingman} 
          active={activeTab === 'WINGMAN'} 
          onClick={() => setActiveTab('WINGMAN')} 
        />
        <NavItem 
          icon={<Info size={22} />} 
          label={t.bio} 
          active={activeTab === 'BIO'} 
          onClick={() => setActiveTab('BIO')} 
        />
         <NavItem 
          icon={<Flame size={22} />} 
          label={t.feed} 
          active={activeTab === 'COMMUNITY'} 
          onClick={() => setActiveTab('COMMUNITY')} 
        />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-all ${active ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-tighter">{label}</span>
  </button>
);

export default Layout;
