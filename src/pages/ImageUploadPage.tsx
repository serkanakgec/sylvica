import { useState, useRef } from 'react';
import { ReadingType } from '../types/reading';
import { Language, getTranslation } from '../i18n/translations';
import { LanguageSelector } from '../components/LanguageSelector';
import { UploadCloud, CheckCircle } from 'lucide-react';

interface ImageUploadPageProps {
  readingType: ReadingType;
  onComplete: (imageData: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function ImageUploadPage({ readingType, onComplete, language, onLanguageChange }: ImageUploadPageProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 2048 * 2048) { // 10MB limit
        setError('File is too large. Please select an image under 10MB.');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onComplete(base64String);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
        setIsLoading(false);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const getUploadMessage = () => {
    switch (readingType) {
      case 'turkish-coffee':
        return 'Upload a photo of your coffee cup for a traditional reading.';
      case 'face-reading':
        return 'Upload a photo of your face to reveal your character and destiny.';
      case 'palm-reading':
        return 'Upload a photo of your palm for insights into your life path.';
      default:
        return 'Upload an image for your reading.';
    }
  };

  return (
    <div className="min-h-screen starfield flex items-center justify-center">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />
      </div>

      <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-sm border-2 border-amber-500/30 rounded-lg p-8 glow-border text-center">
        <h2 className="text-3xl font-decorative text-amber-400 glow-text mb-4">
          {t(`${readingType}_name` as any)}
        </h2>
        <p className="text-slate-300 mb-6">{getUploadMessage()}</p>

        <div
          className="relative border-2 border-dashed border-slate-600 rounded-lg p-8 cursor-pointer hover:border-amber-500/60 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="mx-auto h-48 rounded-lg object-cover" />
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <UploadCloud className="w-16 h-16 mb-4" />
              <p>Click to upload an image</p>
              <p className="text-xs mt-1">(Max 5MB)</p>
            </div>
          )}
        </div>

        {error && <p className="text-red-400 mt-4">{error}</p>}
        
        {selectedImage && (
          <div className="mt-4 text-green-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <p>{selectedImage.name}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedImage || isLoading}
          className="mt-8 w-full bg-amber-500/80 hover:bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Yükleniyor...
            </>
          ) : (
            t('submitReading')
          )}
        </button>
      </div>
    </div>
  );
}
