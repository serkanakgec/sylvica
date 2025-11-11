import { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { ReadingType } from '../types/reading';
import { validateLink, ReferenceCode } from '../services/linkService';
import { Language, getTranslation } from '../i18n/translations';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: ReferenceCode) => void;
  onInvalid: () => void;
  selectedReadingType: ReadingType;
  language: Language;
}

export function ReferenceModal({
  isOpen,
  onClose,
  onSuccess,
  onInvalid,
  selectedReadingType,
  language
}: ReferenceModalProps) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleValidate = async () => {
    if (!referenceNumber.trim()) {
      setError(t('enterReferenceError'));
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const result = await validateLink(referenceNumber.trim());

      if (result.valid && result.codeData) {
        console.log('[DEBUG] Kod doğrulama başarılı. Karşılaştırma yapılıyor...');
        console.log(`[DEBUG]   > Veritabanından gelen reading_type: "${result.codeData.reading_type}"`);
        console.log(`[DEBUG]   > Kullanıcının seçtiği reading_type: "${selectedReadingType}"`);

        if (result.codeData.reading_type && result.codeData.reading_type !== selectedReadingType) {
          console.error('[DEBUG] HATA: Okuma türleri eşleşmiyor!');
          setError("Bu referans kodu, seçtiğiniz okuma türü için geçerli değil.");
          setIsValidating(false);
          return;
        }
        
        console.log('[DEBUG] Karşılaştırma başarılı. onSuccess çağrılıyor.');
        setIsValidating(false);
        setReferenceNumber('');
        setError('');
        onSuccess(result.codeData);
      } else {
        console.error('[DEBUG] validateLink başarısız oldu veya codeData dönmedi.');
        setIsValidating(false);
        onInvalid();
      }
    } catch (err) {
      console.error('[DEBUG] handleValidate içinde beklenmedik bir hata oluştu:', err);
      setIsValidating(false);
      onInvalid();
    }
  };

  const handleClose = () => {
    setReferenceNumber('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div id="reference-modal-content" className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-2 border-amber-500/50 rounded-xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="text-amber-400 w-6 h-6" />
            <h2 className="text-2xl font-decorative text-amber-400">
              {t('enterReferenceTitle')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-slate-300 mb-6">
          {t('enterReferenceDescription')}
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder={t('referencePlaceholder')}
            className="w-full bg-slate-900/50 border-2 border-amber-500/30 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          />

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <AlertCircle className="text-red-400 w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isValidating ? t('validating') : t('continue')}
            </button>
            <button
              onClick={handleClose}
              className="px-6 bg-slate-800/50 border border-amber-500/30 text-amber-400 hover:bg-slate-800/80 hover:border-amber-500/50 py-3 rounded-lg transition-all"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
