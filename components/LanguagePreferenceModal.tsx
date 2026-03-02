import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { languages } from '../translations';
import { LeafIcon } from './Icons';

interface LanguagePreferenceModalProps {
  onLanguageSelect: (language: string) => void;
}

export const LanguagePreferenceModal: React.FC<LanguagePreferenceModalProps> = ({ onLanguageSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const { t } = useTranslation();

  const handleSave = () => {
    onLanguageSelect(selectedLanguage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="bg-surface rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6">
          <LeafIcon className="w-12 h-12 text-primary mx-auto" />
          <h2 className="mt-2 text-2xl font-bold text-text-primary">{t('chooseYourLanguage')}</h2>
        </div>
        
        <div className="space-y-3 my-6">
            {Object.keys(languages).map(lang => (
                 <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`w-full text-left p-4 rounded-lg font-semibold transition-colors duration-200 ${
                        selectedLanguage === lang 
                            ? 'bg-primary text-white ring-2 ring-primary-dark' 
                            : 'bg-background hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                 >
                    {lang}
                 </button>
            ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform hover:scale-[1.02]"
        >
          {t('saveAndContinue')}
        </button>
      </div>
       <style>{`
            @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(20px) scale(0.98); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};
