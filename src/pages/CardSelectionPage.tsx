import { useState, useMemo } from 'react';
import { ReadingType, SelectedCard, readingTypes } from '../types/reading';
import { tarotDeck } from '../data/tarotDeck';
import { Language, getTranslation } from '../i18n/translations';
import { LanguageSelector } from '../components/LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react'; // Loader ikonu için import

export function CardSelectionPage({ readingType, onComplete, language, onLanguageChange }: CardSelectionPageProps) {
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // 1. Buton için 'işlem' durumu eklendi
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const readingConfig = useMemo(() => readingTypes.find(rt => rt.id === readingType), [readingType]);
  const numCards = readingConfig?.cardCount || 0;
  const isSelectionComplete = selectedCards.length === numCards;

  // 2. Deste, useMemo kullanılarak karıştırıldı
  const shuffledDeck = useMemo(() => {
    return [...tarotDeck].sort(() => Math.random() - 0.5);
  }, [readingType]); // readingType değiştiğinde desteyi yeniden karıştır

  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= numCards || selectedCards.some(c => c.cardId === cardId)) {
      return;
    }
    const orientation = Math.random() < 0.7 ? 'upright' : 'reversed';
    setSelectedCards([...selectedCards, { cardId, position: selectedCards.length + 1, orientation }]);
  };

  // 3. 500ms bekleyen ve loader gösteren handleGenerate fonksiyonu eklendi
  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onComplete(selectedCards);
      // Not: onComplete muhtemelen bileşeni kaldıracaktır,
      // ancak kaldırmazsa setIsProcessing(false) eklemek gerekebilir.
    }, 500);
  };

  return (
    <div className="min-h-screen starfield p-4">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />
      </div>
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-decorative text-amber-400 glow-text mb-2 animate-fade-in">
          {t('selectCards')}
        </h1>
        
        {/* 4. İlerleme Çubuğu (Progress Bar) eklendi */}
        <div className="w-full max-w-md mx-auto bg-slate-900/50 border-2 border-amber-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400 font-serif">{readingConfig?.name || t('tarotReading')}</span>
            <span className="text-slate-300">
              {selectedCards.length} / {numCards}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedCards.length / numCards) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-slate-300 mb-8 animate-fade-in">
          {t('trustIntuition')} {numCards} {t(numCards === 1 ? 'card' : 'cards')}
        </p>

        {/* Kartların listelendiği alan güncellendi */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 justify-center pb-16">
          {shuffledDeck.map((card, index) => { // 'shuffledDeck' kullanılıyor
            const selectedCard = selectedCards.find(sc => sc.cardId === card.id);
            const isSelected = !!selectedCard;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                // 5. Kartların altındaki yazıların görünmesi için 'relative' ve 'pb' ayarlandı
                className="relative" 
              >
                <button
                  onClick={() => handleCardClick(card.id)}
                  disabled={isSelected || selectedCards.length >= numCards}
                  className={`aspect-[2/3] w-full rounded-lg transition-all duration-300 ${
                    isSelected
                      ? 'transform scale-110 -translate-y-4 shadow-lg shadow-amber-500/50 opacity-100'
                      : 'hover:-translate-y-2'
                  } disabled:opacity-30 disabled:hover:translate-y-0`}
                >
                  {/* 6. Kart seçildiğinde yüzünü, seçilmediğinde arkasını gösterme */}
                  {!isSelected ? (
                    <img src="https://previews.123rf.com/images/antusenoktanya/antusenoktanya2304/antusenoktanya230400014/204295155-mystical-tarot-card-witch-holding-the-sun-engraved-on-a-black-background-background-for-stories.jpg" alt="Tarot Card Back" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="relative w-full h-full">
                      <div
                        // 7. Ters kartlar için 'rotate-180' eklendi
                        className={`w-full h-full transition-transform duration-500 ${
                          selectedCard.orientation === 'reversed' ? 'rotate-180' : ''
                        }`}
                      >
                        <img
                          src={card.imageUrl} // card.imageUrl kullanıldı
                          alt={card.name} // card.name kullanıldı
                          className="w-full h-full object-cover rounded-lg border-2 border-amber-400"
                        />
                      </div>
                      {/* 8. Seçim sırası numarası eklendi */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs shadow-lg z-10">
                        {selectedCard.position}
                      </div>
                    </div>
                  )}
                </button>
                {/* 9. Kart adı ve 'Ters' bilgisi eklendi */}
                {isSelected && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
                    <p className="text-amber-400 text-xs font-serif">
                      {card.name}
                    </p>
                    {selectedCard.orientation === 'reversed' && (
                      <p className="text-amber-400/70 text-xs">
                        ({t('reversed')})
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {isSelectionComplete && ( // Koşul güncellendi
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mt-8"
            >
              <button
                onClick={handleGenerate} // onClick güncellendi
                disabled={isProcessing} // disabled eklendi
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-semibold rounded-lg transition-all transform hover:scale-105 text-xl flex items-center justify-center min-w-[200px]"
              >
                {/* 10. Buton içeriği 'isProcessing' durumuna göre güncellendi */}
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  t('submitReading')
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}