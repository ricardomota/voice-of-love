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
  const base = greetingContent.greeting(helloName);

  // Get topic seed and add personalization
  let topicText = topicSeed(state.topic, language);
  
  // Add personalization if available
  if (state.personalization?.favoriteMemory) {
    const memoryReference = language === 'pt-BR' 
      ? ` Lembro de ${state.personalization.favoriteMemory.toLowerCase()}.`
      : language === 'es'
      ? ` Recuerdo ${state.personalization.favoriteMemory.toLowerCase()}.`
      : ` I remember ${state.personalization.favoriteMemory.toLowerCase()}.`;
    topicText += memoryReference;
  }
  
  if (state.personalization?.personalDetail) {
    const detailReference = language === 'pt-BR'
      ? ` ${state.personalization.personalDetail}.`
      : language === 'es' 
      ? ` ${state.personalization.personalDetail}.`
      : ` ${state.personalization.personalDetail}.`;
    topicText += detailReference;
  }

  const primarySeed = `${applyStyleTone(base, state.style, language)} ${topicText}`;
  // Keep within 120–180 chars by slicing if needed
  const primary = primarySeed.length > 180 ? primarySeed.slice(0, 177).trimEnd() + '…' : primarySeed;

  const followSeed = topicContent.followUp;
  const followStyled = applyStyleTone(followSeed, state.style, language);
  const followUp = followStyled.length > 100 ? followStyled.slice(0, 97).trimEnd() + '…' : followStyled;

  return { 
    primary, 
    followUp, 
    voiceLanguage: getLanguageCode(language),
    context: `Generated for ${state.relationship} speaking to ${state.name || 'you'} about ${state.topic}`
  };
}
