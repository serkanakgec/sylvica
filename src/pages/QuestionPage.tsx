import { useState } from 'react';
import { ReadingType } from '../types/reading';
import { Language, getTranslation } from '../i18n/translations';
import { LanguageSelector } from '../components/LanguageSelector';

interface QuestionPageProps {
  readingType: ReadingType;
  onContinue: (question: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function QuestionPage({ onContinue, language, onLanguageChange }: QuestionPageProps) {
  const [question, setQuestion] = useState('');
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <div className="min-h-screen starfield flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-50">
          <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />
      </div>
      <div className="w-full max-w-2xl text-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-amber-500/30 rounded-lg p-8 animate-fade-in">
          <h1 className="text-4xl font-decorative text-amber-400 glow-text mb-4">
            {t('questionPrompt')}
          </h1>
          <p className="text-slate-300 mb-8">
            {t('questionDescription')}
          </p>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-32 bg-slate-900/50 border-2 border-amber-500/30 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none transition-colors mb-6"
            placeholder={t('questionPlaceholder')}
          />

          <button
            onClick={() => onContinue(question)}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
          >
            {t('continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
