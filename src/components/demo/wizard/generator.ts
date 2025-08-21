import { DemoState, Topic, Warmth, Formality, Energy, Pace } from './types';
import { Language } from '@/contexts/LanguageContext';

const getLanguageCode = (language: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'en-US',
    'pt-BR': 'pt-BR', 
    'es': 'es-ES'
  };
  return languageMap[language] || 'en-US';
};

const getTopicContent = (language: string) => {
  const content = {
    en: {
      'Birthday message': 'It\'s your special day, and I picked this memory just for you — a candlelit cake and that big smile.',
      'Words of encouragement': 'One small step at a time, hand in hand, and I\'ll cheer for you with each little victory.',
      'Sunday lunch memory': 'I can almost smell the fresh bread and hear our laughter around the table on those sunny Sundays.',
      'Bedtime story': 'Close your eyes, breathe slow, and I\'ll guide you through a tiny tale where everything feels safe.',
      'Gentle reminder': 'Just a tiny reminder, softly said, so the day feels lighter and easier to follow.',
      'A funny story': 'Remember when we laughed so hard we cried — the little mix‑up that turned into our favorite joke?',
      default: 'I\'m here with a small memory to hold onto, something warm we can revisit together.',
      followUp: 'If you want, we can talk about another moment or simply sit quietly for a while.'
    },
    'pt-BR': {
      'Birthday message': 'É o seu dia especial, e escolhi esta lembrança só para você — um bolo com velas e aquele sorriso grande.',
      'Words of encouragement': 'Um passo pequeno de cada vez, de mãos dadas, e eu vou torcer por você a cada pequena vitória.',
      'Sunday lunch memory': 'Quase posso sentir o cheiro do pão fresco e ouvir nossas risadas na mesa naqueles domingos ensolarados.',
      'Bedtime story': 'Feche os olhos, respire devagar, e vou te guiar por uma pequena história onde tudo é seguro.',
      'Gentle reminder': 'Só um pequeno lembrete, dito com carinho, para que o dia fique mais leve e fácil de seguir.',
      'A funny story': 'Lembra quando rimos tanto que choramos — aquela confusão que virou nossa piada favorita?',
      default: 'Estou aqui com uma pequena lembrança para guardar, algo caloroso que podemos revisitar juntos.',
      followUp: 'Se quiser, podemos falar sobre outro momento ou simplesmente ficar em silêncio por um tempo.'
    },
    es: {
      'Birthday message': 'Es tu día especial, y elegí este recuerdo solo para ti — un pastel con velas y esa gran sonrisa.',
      'Words of encouragement': 'Un paso pequeño a la vez, de la mano, y te alentaré con cada pequeña victoria.',
      'Sunday lunch memory': 'Casi puedo oler el pan fresco y escuchar nuestras risas en la mesa en esos domingos soleados.',
      'Bedtime story': 'Cierra los ojos, respira despacio, y te guiaré por un pequeño cuento donde todo se siente seguro.',
      'Gentle reminder': 'Solo un pequeño recordatorio, dicho suavemente, para que el día se sienta más ligero y fácil de seguir.',
      'A funny story': '¿Recuerdas cuando nos reímos tanto que lloramos — esa pequeña confusión que se convirtió en nuestro chiste favorito?',
      default: 'Estoy aquí con un pequeño recuerdo para guardar, algo cálido que podemos revisitar juntos.',
      followUp: 'Si quieres, podemos hablar de otro momento o simplemente quedarnos en silencio por un rato.'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

// Helpers to improve personalization quality
function normalizeText(input: string) {
  if (!input) return '';
  let s = input.replace(/\s+/g, ' ').trim();
  // remove duplicated consecutive words (e.g., "palavras palavras" -> "palavras")
  s = s.replace(/\b(\p{L}+)\s+\1\b/giu, '$1');
  return s;
}

function toSecondPersonPT(text: string) {
  return text
    .replace(/\b(a\s+)?minha\s+m[aã]e\b/gi, 'você')
    .replace(/\b(a\s+)?minha\s+mama[eé]\b/gi, 'você')
    .replace(/\b(o\s+)?meu\s+pai\b/gi, 'você');
}
function toSecondPersonES(text: string) {
  return text
    .replace(/\b(mi\s+mam[áa]|mi\s+madre)\b/gi, 'tú')
    .replace(/\b(mi\s+padre)\b/gi, 'tú');
}
function toSecondPersonEN(text: string) {
  return text.replace(/\bmy\s+(mom|mother|dad|father)\b/gi, 'you');
}

function adjustPerspective(text: string, language: string) {
  if (!text) return text;
  if (language === 'pt-BR') return toSecondPersonPT(text);
  if (language === 'es') return toSecondPersonES(text);
  return toSecondPersonEN(text);
}

function containsItalianCue(text: string) {
  return /italian(o|a)?|italiano/gi.test(text || '');
}

const getGreetingContent = (language: string) => {
  const content = {
    en: {
      greeting: (name: string) => `${name}, I'm here with you. Let's remember this together.`,
      dear: 'dear'
    },
    'pt-BR': {
      greeting: (name: string) => `${name}, estou aqui com você. Vamos lembrar disso juntos.`,
      dear: 'querido'
    },
    es: {
      greeting: (name: string) => `${name}, estoy aquí contigo. Recordemos esto juntos.`,
      dear: 'querido'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

function applyStyleTone(text: string, style: DemoState['style'], language: string) {
  let result = text;
  
  // Warmth adjustments based on language
  if (style.warmth === 'Gentle') {
    const warmPrefixes = {
      en: 'Dear ',
      'pt-BR': 'Querido ',
      es: 'Querido '
    };
    const prefix = warmPrefixes[language as keyof typeof warmPrefixes] || warmPrefixes.en;
    result = `${prefix}${result}`;
  }
  
  if (style.warmth === 'Direct') {
    const replacements = {
      en: { from: /I'm here with you\./, to: "I'm right here with you." },
      'pt-BR': { from: /estou aqui com você\./, to: "estou bem aqui com você." },
      es: { from: /estoy aquí contigo\./, to: "estoy justo aquí contigo." }
    };
    const replacement = replacements[language as keyof typeof replacements] || replacements.en;
    result = result.replace(replacement.from, replacement.to);
  }

  // Formality adjustments based on language
  if (style.formality === 'Polite') {
    const replacements = {
      en: { from: /Let's/, to: 'Let us' },
      'pt-BR': { from: /Vamos/, to: 'Vamos' }, // Already formal in Portuguese
      es: { from: /Recordemos/, to: 'Recordemos' } // Already formal in Spanish
    };
    const replacement = replacements[language as keyof typeof replacements] || replacements.en;
    result = result.replace(replacement.from, replacement.to);
  }

  // Energy adjustments
  if (style.energy === 'Lively') result = result + ' ✨';
  if (style.energy === 'Calm') result = result.replace(/!/g, '.');

  // Pace hint (used as subtle punctuation tweaks)
  if (style.pace === 'Slow') result = result.replace(/\./g, '…');
  if (style.pace === 'Fast') {
    const fastReplacements = {
      en: { from: 'together', to: 'together, okay?' },
      'pt-BR': { from: 'juntos', to: 'juntos, está bem?' },
      es: { from: 'juntos', to: 'juntos, ¿está bien?' }
    };
    const replacement = fastReplacements[language as keyof typeof fastReplacements];
    if (replacement) {
      result = result.replace(replacement.from, replacement.to);
    }
  }

  return result;
}

function topicSeed(topic: Topic | undefined, language: string) {
  const content = getTopicContent(language);
  return content[topic as keyof typeof content] || content.default;
}

export function generatePreviewText(state: DemoState, language: Language = 'en') {
  const greetingContent = getGreetingContent(language);
  const topicContent = getTopicContent(language);
  
  const helloName = state.name && state.name.trim().length > 0 ? state.name.trim() : greetingContent.dear;
  let base = greetingContent.greeting(helloName);

  // Get topic seed and enhance with personalization
  let topicText = topicSeed(state.topic, language);
  
  // Create more personalized and engaging content
  const personalizations = [];
  
  // Add favorite memory with more context (preserve user's wording but fix perspective)
  if (state.personalization?.favoriteMemory) {
    const raw = state.personalization.favoriteMemory.trim();
    const adjusted = normalizeText(adjustPerspective(raw, language));
    if (adjusted.length > 0) {
      const memoryReference =
        language === 'pt-BR'
          ? `Guardo com carinho: ${adjusted}.`
          : language === 'es'
          ? `Guardo con cariño: ${adjusted}.`
          : `I hold this close: ${adjusted}.`;
      personalizations.push(memoryReference);
    }
  }
  
  // Add personal detail with warmth and detect signature phrases
  if (state.personalization?.personalDetail) {
    const rawDetail = state.personalization.personalDetail.trim();
    if (rawDetail.length > 0) {
      const quoteMatch = rawDetail.match(/["“”'«»](.+?)["“”'«»]/);
      if (quoteMatch && quoteMatch[1]) {
        const quoted = quoteMatch[1].trim();
        const signatureReference =
          language === 'pt-BR'
            ? `Como você sempre dizia: "${quoted}".`
            : language === 'es'
            ? `Como siempre decías: "${quoted}".`
            : `As you always said: "${quoted}."`;
        personalizations.push(signatureReference);
      } else {
        const adjustedDetail = normalizeText(adjustPerspective(rawDetail, language));
        const detailReference =
          language === 'pt-BR'
            ? `E eu sempre amei isso em você: ${adjustedDetail}.`
            : language === 'es'
            ? `Y siempre amé esto de ti: ${adjustedDetail}.`
            : `And I always loved this about you: ${adjustedDetail}.`;
        personalizations.push(detailReference);
      }
    }
  }
  
  // Add time context if available
  if (state.personalization?.preferredTime) {
    const timeContexts = {
      morning: {
        'pt-BR': 'Nossas manhãs juntos eram sempre tão pacíficas.',
        'es': 'Nuestras mañanas juntos siempre fueron tan pacíficas.',
        'en': 'Our mornings together were always so peaceful.'
      },
      afternoon: {
        'pt-BR': 'Aquelas tardes que passávamos conversando...',
        'es': 'Esas tardes que pasábamos conversando...',
        'en': 'Those afternoons we spent talking...'
      },
      evening: {
        'pt-BR': 'Nossas noites eram sempre cheias de carinho.',
        'es': 'Nuestras noches siempre estaban llenas de cariño.',
        'en': 'Our evenings were always filled with warmth.'
      }
    };
    const timeText = timeContexts[state.personalization.preferredTime][language as keyof typeof timeContexts.morning];
    personalizations.push(timeText);
  }

  // Combine personalization in a natural way
  // Add small stylistic cues based on details (e.g., Italian mix)
  const combinedRaw = `${state.personalization?.favoriteMemory || ''} ${state.personalization?.personalDetail || ''}`;
  if (language === 'pt-BR' && containsItalianCue(combinedRaw)) {
    personalizations.push('E, como você adora misturar italiano e português: "ti voglio bene".');
  }

  if (personalizations.length > 0) {
    const connector = ' ';
    topicText = `${topicText}${connector}${personalizations.join(' ')}`;
  }

  // Apply relationship-specific tone adjustments
  if (state.relationship) {
    const relationshipAdjustments = {
      'Mom': {
        'pt-BR': (text: string) => text.replace('querido', 'meu amor'),
        'es': (text: string) => text.replace('querido', 'mi amor'),
        'en': (text: string) => text.replace('dear', 'my sweetheart')
      },
      'Dad': {
        'pt-BR': (text: string) => text.replace('querido', 'meu filho'),
        'es': (text: string) => text.replace('querido', 'mi hijo'),
        'en': (text: string) => text.replace('dear', 'kiddo')
      },
      'Grandma': {
        'pt-BR': (text: string) => text.replace('querido', 'meu netinho'),
        'es': (text: string) => text.replace('querido', 'mi nietito'),
        'en': (text: string) => text.replace('dear', 'my grandchild')
      },
      'Grandpa': {
        'pt-BR': (text: string) => text.replace('querido', 'meu netinho'),
        'es': (text: string) => text.replace('querido', 'mi nietito'),
        'en': (text: string) => text.replace('dear', 'my grandchild')
      }
    };
    
    const adjustment = relationshipAdjustments[state.relationship]?.[language as keyof typeof relationshipAdjustments.Mom];
    if (adjustment) {
      base = adjustment(base);
      topicText = adjustment(topicText);
    }
  }

  const primaryRaw = `${applyStyleTone(base, state.style, language)} ${topicText}`;
  const primarySeed = normalizeText(primaryRaw);
  // Keep within reasonable length but allow more space for personalization
  const primary = primarySeed.length > 360 ? primarySeed.slice(0, 357).trimEnd() + '…' : primarySeed;

  const followSeed = topicContent.followUp;
  const followStyled = applyStyleTone(followSeed, state.style, language);
  const followUp = followStyled.length > 120 ? followStyled.slice(0, 117).trimEnd() + '…' : followStyled;

  return { 
    primary, 
    followUp, 
    voiceLanguage: getLanguageCode(language),
    context: `Generated for ${state.relationship} speaking to ${state.name || 'you'} about ${state.topic}`
  };
}
