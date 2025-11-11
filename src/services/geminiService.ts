import { TarotCard } from '../data/tarotDeck';
import { SelectedCard, ReadingType, readingTypes } from '../types/reading';
import { Language } from '../i18n/translations';
import { UserInfo } from '../pages/UserInfoPage';

export interface ReadingResponse {
  reading: string;
  error?: string;
}

const getLanguageName = (lang: Language): string => {
  const names: Record<Language, string> = {
    en: 'English',
    tr: 'Turkish (Türkçe)',
    de: 'German (Deutsch)',
    it: 'Italian (Italiano)',
    fr: 'French (Français)',
    ru: 'Russian (Русский)',
    zh: 'Chinese (中文)',
    es: 'Spanish (Español)',
    pt: 'Portuguese (Português)',
    nl: 'Dutch (Nederlands)',
    ja: 'Japanese (日本語)',
    fa: 'Persian (فارسی)',
    ar: 'Arabic (العربية)',
    el: 'Greek (Ελληνικά)'
  };
  return names[lang] || 'English';
};

const getReadingTypeContext = (readingType: ReadingType): string => {
  const contexts: Record<ReadingType, string> = {
    'daily': 'This is a Daily Tarot reading to provide guidance for the day ahead. Focus on immediate influences and what the querent should be aware of today.',
    '3-card': 'This is a Past-Present-Future spread. Analyze how past events influence the present situation and what the future may hold.',
    'celtic-cross': 'This is a comprehensive Celtic Cross spread. Provide deep insight into the situation, covering all aspects from challenges to outcomes.',
    'relationship': 'This is a Relationship & Love reading. Focus on romantic connections, partnerships, emotional bonds, and relationship dynamics.',
    'career': 'This is a Career & Money reading. Focus on professional life, financial matters, work opportunities, and material success.',
    'soulmate': 'This is a Soulmate reading. Focus on divine partnerships, soul connections, destined relationships, and spiritual love.',
    'year': 'This is a Year Ahead reading with 12 cards for each month. Provide guidance for the entire year, highlighting key periods and themes.',
    'divination': 'This is a Divination Tarot reading focused on predicting future outcomes. Emphasize possible future events, timing, and probabilities.',
    'psychological': 'This is a Psychological Tarot reading. Focus on the subconscious mind, emotional patterns, inner conflicts, and psychological growth.',
    'spiritual': 'This is a Spiritual Guidance reading. Focus on the soul\'s journey, higher purpose, spiritual lessons, and connection to the divine.',
    'meditation': 'This is a Meditation Tarot reading. Focus on inner awareness, energy balance, chakras, and present-moment consciousness.',
    'decision': 'This is a Decision Making reading. Help the querent weigh two options clearly, showing pros and cons of each path.',
    'turkish-coffee': 'This is a Turkish Coffee reading. Analyze the patterns in the coffee grounds to provide insights about the future and the querent\'s current situation.',
    'face-reading': 'This is a Face Reading session. Analyze the facial features to reveal personality traits, strengths, weaknesses, and life path.',
    'palm-reading': 'This is a Palm Reading session. Analyze the lines and mounts on the palm to provide insights into life events, character, and destiny.'
  };
  return contexts[readingType] || '';
};

export async function generateDetailedReading(
  readingType: ReadingType,
  selectedCards: SelectedCard[],
  deck: TarotCard[],
  question: string,
  language: Language = 'en',
  imageData?: string,
  userInfo?: UserInfo
): Promise<ReadingResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      reading: '',
      error: 'Gemini API key is not configured. Please add your API key to the .env file as VITE_GEMINI_API_KEY'
    };
  }

  try {
    const readingConfig = readingTypes.find(t => t.id === readingType);
    const readingContext = getReadingTypeContext(readingType);
    const languageName = getLanguageName(language);

    let userInfoPrompt = '';
    if (userInfo) {
      userInfoPrompt = `
The user has provided the following personal information for this consultation:
- Name: ${userInfo.name}
- Date of Birth: ${userInfo.dob}
This information should be used to add a more personal and astrological depth to the reading.`;
    }

    let prompt = '';
    const parts: any[] = [];

    if (readingConfig?.inputType === 'image' && imageData) {
      prompt = `${readingContext}
The user has asked the following question: "${question}"
${userInfoPrompt}
Please provide a detailed and compassionate reading in ${languageName} based on the provided image. Analyze the symbols, shapes, and patterns to answer the user's question.`;
      parts.push({ text: prompt });
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: imageData.split(',')[1]
        }
      });
    } else {
      const cardsInfo = selectedCards.map(sc => {
        const card = deck.find(c => c.id === sc.cardId);
        if (!card) return null;
        return `${sc.position}. ${card.name} - ${sc.orientation === 'upright' ? 'Upright' : 'Reversed'}`;
      }).filter(Boolean).join('\n');

      prompt = `${readingContext}
The user has asked the following question: "${question}"
${userInfoPrompt}
For this reading, they selected these cards (in order):
${cardsInfo}
Please provide a detailed, compassionate tarot reading in ${languageName}.`;
      parts.push({ text: prompt });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: parts }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate reading');
    }

    const data = await response.json();
    const reading = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reading) {
      throw new Error('No reading generated');
    }

    return { reading };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      reading: '',
      error: error instanceof Error ? error.message : 'Failed to generate reading. Please try again.',
    };
  }
}
