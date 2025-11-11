import { useState } from 'react';
import { ReadingType, SelectedCard, readingTypes } from './types/reading';
import { ReadingTypePage } from './pages/ReadingTypePage';
import { QuestionPage } from './pages/QuestionPage';
import { CardSelectionPage } from './pages/CardSelectionPage';
import { ImageUploadPage } from './pages/ImageUploadPage';
import { ReadingResultPage } from './pages/ReadingResultPage';
import { UserInfoPage, UserInfo } from './pages/UserInfoPage';
import { generateDetailedReading } from './services/geminiService';
import { saveReading, ReferenceCode } from './services/linkService';
import { tarotDeck } from './data/tarotDeck';
import { Language, getTranslation } from './i18n/translations';
import { ShieldAlert, CheckCircle } from 'lucide-react';

type AppState = 'type-selection' | 'user-info' | 'question' | 'card-selection' | 'image-upload' | 'result' | 'consultation-success' | 'invalid-link';

function App() {
  const [appState, setAppState] = useState<AppState>('type-selection');
  const [readingType, setReadingType] = useState<ReadingType | null>(null);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  const [validatedCode, setValidatedCode] = useState<ReferenceCode | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSelectType = (type: ReadingType, code: ReferenceCode) => {
    setReadingType(type);
    setValidatedCode(code);
    const currentReadingType = readingTypes.find(rt => rt.id === type);

    if (code.type === 'consultancy') {
      setAppState('user-info');
    } else {
      if (currentReadingType?.inputType === 'image') {
        setAppState('image-upload');
      } else {
        setAppState('question');
      }
    }
  };

  const handleUserInfoSubmit = async (info: UserInfo) => {
    setUserInfo(info);
    const currentReadingType = readingTypes.find(rt => rt.id === readingType);
    if (currentReadingType?.inputType === 'image') {
      setAppState('image-upload');
    } else {
      setAppState('question');
    }
  };

  const handleQuestionSubmit = (q: string) => {
    setQuestion(q);
    const currentReadingType = readingTypes.find(rt => rt.id === readingType);
    if (currentReadingType?.inputType === 'image') {
      setAppState('image-upload');
    } else {
      setAppState('card-selection');
    }
  };

  const handleImageSelected = async (imageData: string) => {
    setReading('');
    setError('');

    if (!readingType || !validatedCode) {
      setError("Application error: Reading type or reference code is missing.");
      return;
    }

    const result = await generateDetailedReading(readingType, [], tarotDeck, question, language, imageData, validatedCode.type === 'consultancy' ? userInfo! : undefined);
    if (result.error) {
        setError(result.error);
        return;
    }

    const saveResult = await saveReading(
      validatedCode.code,
      result.reading,
      validatedCode.type === 'consultancy' ? userInfo! : undefined
    );

    if (!saveResult.success) {
        setError(`Database error: ${saveResult.error}`);
        return;
    }

    if (validatedCode.type === 'consultancy') {
      setAppState('consultation-success');
    } else {
      setReading(result.reading);
      setAppState('result');
    }
  };

  const handleCardsSelected = async (cards: SelectedCard[]) => {
    setSelectedCards(cards);
    setReading('');
    setError('');

    if (!readingType || !validatedCode) {
      setError("Application error: Reading type or reference code is missing.");
      return;
    }
    
    const result = await generateDetailedReading(readingType, cards, tarotDeck, question, language, undefined, validatedCode.type === 'consultancy' ? userInfo! : undefined);
    if (result.error) {
        setError(result.error);
        return;
    }

    const saveResult = await saveReading(
      validatedCode.code,
      result.reading,
      validatedCode.type === 'consultancy' ? userInfo! : undefined
    );

    if (!saveResult.success) {
        setError(`Database error: ${saveResult.error}`);
        return;
    }

    if (validatedCode.type === 'consultancy') {
      setAppState('consultation-success');
    } else {
      setReading(result.reading);
      setAppState('result');
    }
  };
  
  const handleInvalidLink = () => {
    setAppState('invalid-link');
  };

  if (appState === 'invalid-link') {
    return (
      <div className="min-h-screen starfield flex items-center justify-center text-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-red-500/30 rounded-lg p-8 max-w-md mx-4">
          <ShieldAlert className="text-red-400 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-decorative text-red-400 mb-2">{t('invalidLinkTitle')}</h1>
          <p className="text-slate-300">
            {t('invalidLinkMessage')}
          </p>
        </div>
      </div>
    );
  }

  if (appState === 'consultation-success') {
    return (
      <div className="min-h-screen starfield flex items-center justify-center text-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-green-500/30 rounded-lg p-8 max-w-md mx-4">
          <CheckCircle className="text-green-400 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-decorative text-green-400 mb-2">
            {t('consultationSuccessTitle')}
          </h1>
          <p className="text-slate-300 mb-4">
            {t('consultationSuccessMessage')}
          </p>
          <p className="text-slate-400 text-sm">
            {t('thankYou')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {appState === 'type-selection' && (
        <ReadingTypePage
          onSelectType={handleSelectType}
          onInvalidLink={handleInvalidLink}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {appState === 'user-info' && (
        <UserInfoPage
          onSubmit={handleUserInfoSubmit}
          language={language}
        />
      )}

      {appState === 'question' && readingType && (
        <QuestionPage
          readingType={readingType}
          onContinue={handleQuestionSubmit}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {appState === 'card-selection' && readingType && (
        <CardSelectionPage
          readingType={readingType}
          onComplete={handleCardsSelected}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {appState === 'image-upload' && readingType && (
        <ImageUploadPage
          readingType={readingType}
          onComplete={handleImageSelected}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {appState === 'result' && readingType && validatedCode && (
        <ReadingResultPage
          readingType={readingType}
          selectedCards={selectedCards}
          reading={reading}
          question={question}
          language={language}
          onLanguageChange={handleLanguageChange}
          codeType={validatedCode.type}
        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-500/50 rounded-lg p-4 text-red-200 max-w-md shadow-lg z-50">
          {error}
        </div>
      )}
    </>
  );
}

export default App;
