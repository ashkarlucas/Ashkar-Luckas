
import React, { useState } from 'react';
import Layout from './components/Layout';
import RedFlagDetector from './components/RedFlagDetector';
import WingmanAI from './components/WingmanAI';
import BioAnalyzer from './components/BioAnalyzer';
import Community from './components/Community';
import { AnalysisType, UserProfile, Language } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>('RED_FLAGS');
  const [lang, setLang] = useState<Language>('fr');
  const [profile, setProfile] = useState<UserProfile>({
    isPremium: false,
    analysesRemaining: 3
  });

  const decrementCredits = () => {
    if (profile.isPremium) return true;
    if (profile.analysesRemaining > 0) {
      setProfile(prev => ({ ...prev, analysesRemaining: prev.analysesRemaining - 1 }));
      return true;
    }
    return false;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'RED_FLAGS':
        return <RedFlagDetector onAnalyze={decrementCredits} credits={profile.analysesRemaining} isPremium={profile.isPremium} lang={lang} />;
      case 'WINGMAN':
        return <WingmanAI onAnalyze={decrementCredits} credits={profile.analysesRemaining} isPremium={profile.isPremium} lang={lang} />;
      case 'BIO':
        return <BioAnalyzer onAnalyze={decrementCredits} credits={profile.analysesRemaining} isPremium={profile.isPremium} lang={lang} />;
      case 'COMMUNITY':
        return <Community lang={lang} />;
      default:
        return <RedFlagDetector onAnalyze={decrementCredits} credits={profile.analysesRemaining} isPremium={profile.isPremium} lang={lang} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => setActiveTab(tab as AnalysisType)} 
      isPremium={profile.isPremium} 
      lang={lang} 
      setLang={setLang}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
