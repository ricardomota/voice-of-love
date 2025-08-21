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
  // Normalizers and helpers (scoped to keep file lean)
  const outputLanguage = getLanguageCode(language); // BCP-47 for TTS

  type RoleCore = 'mother' | 'father' | 'grandma' | 'grandpa' | 'partner' | 'friend' | 'other';
  type MomentCore = 'birthday' | 'encouragement' | 'sunday_lunch' | 'bedtime' | 'gentle_reminder' | 'funny_story';
  type ToDCore = 'morning' | 'afternoon' | 'night';

  const mapRole = (r?: DemoState['relationship']): RoleCore => {
    switch (r) {
      case 'Mom': return 'mother';
      case 'Dad': return 'father';
      case 'Grandma': return 'grandma';
      case 'Grandpa': return 'grandpa';
      case 'Partner': return 'partner';
      case 'Friend': return 'friend';
      default: return 'other';
    }
  };

  const mapMoment = (t?: DemoState['topic']): MomentCore => {
    switch (t) {
      case 'Birthday message': return 'birthday';
      case 'Words of encouragement': return 'encouragement';
      case 'Sunday lunch memory': return 'sunday_lunch';
      case 'Bedtime story': return 'bedtime';
      case 'Gentle reminder': return 'gentle_reminder';
      case 'A funny story': return 'funny_story';
      default: return 'encouragement';
    }
  };

  const mapToD = (t?: DemoState['personalization'] extends infer P ? P extends object ? P[keyof P] : never : never): ToDCore | undefined => {
    const v = state.personalization?.preferredTime;
    if (!v) return undefined;
    if (v === 'morning') return 'morning';
    if (v === 'afternoon') return 'afternoon';
    return 'night'; // evening → night
  };

  const mapWarmth = (w?: Warmth) => (w === 'Gentle' ? 'affectionate' : w === 'Direct' ? 'direct' : 'balanced');
  const mapFormality = (f?: Formality) => (f === 'Polite' ? 'polite' : f === 'Casual' ? 'casual' : 'neutral');
  const mapEnergy = (e?: Energy) => (e === 'Lively' ? 'lively' : e === 'Calm' ? 'calm' : 'balanced');
  const mapPace = (p?: Pace) => (p === 'Fast' ? 'fast' : p === 'Slow' ? 'slow' : 'normal');

  const roleCore = mapRole(state.relationship);
  const momentCore = mapMoment(state.topic);
  const todCore = mapToD(undefined);
  const affection = mapWarmth(state.style?.warmth);
  const formality = mapFormality(state.style?.formality);
  const energy = mapEnergy(state.style?.energy);
  const pace = mapPace(state.style?.pace);

  // Greeting per policy
  function greeting(nickname?: string): string {
    const name = (nickname || '').trim();
    if (name) return `${name},`;
    if (language === 'pt-BR') return 'Meu amor,';
    if (language === 'es') return 'Mi amor,';
    return 'My love,';
  }

  // Time-of-day phrase (once only)
  function timeOfDayPhrase(t?: ToDCore): string {
    if (!t) return '';
    if (language === 'pt-BR') return t === 'morning' ? 'de manhã' : t === 'afternoon' ? 'à tarde' : 'esta noite';
    if (language === 'es') return t === 'morning' ? 'por la mañana' : t === 'afternoon' ? 'esta tarde' : 'esta noche';
    return t === 'morning' ? 'this morning' : t === 'afternoon' ? 'this afternoon' : 'tonight';
  }

  // Memory rewrite: speaker in first person, listener in second person.
  function rewriteMemory(raw?: string): string {
    if (!raw) return '';
    let m = normalizeText(raw);
    // Speaker → first person
    if (language === 'pt-BR') {
      m = m.replace(/\b(minha|a minha)\s+m[ãa]e\b/gi, 'eu')
           .replace(/\b(meu)\s+pai\b/gi, 'eu')
           .replace(/\bela\b/gi, 'eu');
      if (['mother','father','grandma','grandpa'].includes(roleCore)) {
        m = m.replace(/\bminha\s+escola\b/gi, 'sua escola');
      }
    } else if (language === 'es') {
      m = m.replace(/\b(mi\s+mam[áa]|mi\s+madre)\b/gi, 'yo')
           .replace(/\b(mi\s+padre)\b/gi, 'yo')
           .replace(/\bella\b/gi, 'yo');
      if (['mother','father','grandma','grandpa'].includes(roleCore)) {
        m = m.replace(/\bmi\s+escuela\b/gi, 'tu escuela');
      }
    } else {
      m = m.replace(/\bmy\s+(mom|mother|dad|father)\b/gi, 'I')
           .replace(/\bshe\b/gi, 'I')
           .replace(/\bhe\b/gi, 'I');
      if (['mother','father','grandma','grandpa'].includes(roleCore)) {
        m = m.replace(/\bmy\s+school\b/gi, 'your school');
      }
    }
    // Listener possessives (best-effort)
    if (language === 'en') m = m.replace(/\bmy\s+([a-z]+)/gi, 'your $1');
    if (language === 'pt-BR') m = m.replace(/\bmeu\s+([\p{L}]+)/giu, 'seu $1').replace(/\bminha\s+([\p{L}]+)/giu, 'sua $1');
    if (language === 'es') m = m.replace(/\bmi\s+([\p{L}]+)/giu, 'tu $1');
    return m;
  }

  // Trait format (single use if provided)
  function traitOnce(raw?: string): string {
    const t = normalizeText(raw || '');
    if (!t) return '';
    if (language === 'pt-BR') return `eu admiro em você: ${t}`;
    if (language === 'es') return `admiro en ti: ${t}`;
    return `I admire in you: ${t}`;
  }

  const nick = state.name || '';
  const greet = greeting(nick);
  const tod = timeOfDayPhrase(todCore);
  const mem = rewriteMemory(state.personalization?.favoriteMemory);
  const trait = traitOnce(state.personalization?.personalDetail);

  // Build message per moment, with tone controls
  function compose(): string {
    const allowEmojis = true; // default since state has no flag
    const heart = allowEmojis ? (language === 'pt-BR' || language === 'es' ? ' ❤️' : ' ❤️') : '';
    const spark = allowEmojis ? ' ✨' : '';
    const moon = allowEmojis ? ' 🌙' : '';

    const sentences: string[] = [];

    // Sentence helpers ensuring exactly one time-of-day mention if available
    const todPart = tod ? ` ${tod}` : '';

    switch (momentCore) {
      case 'birthday': {
        if (language === 'pt-BR') {
          sentences.push(`${greet} parabéns${todPart}.`);
          if (mem) sentences.push(`Eu me lembro com carinho de quando ${mem}.`);
          if (trait) sentences.push(`E tem algo que ${trait}.`);
          sentences.push(`Que este novo ciclo te traga leveza e alegria; eu estou aqui com você.${heart}`);
        } else if (language === 'es') {
          sentences.push(`${greet} feliz cumpleaños${todPart}.`);
          if (mem) sentences.push(`Recuerdo con cariño cuando ${mem}.`);
          if (trait) sentences.push(`Y hay algo que ${trait}.`);
          sentences.push(`Que este nuevo ciclo te encuentre con calma y alegría; estoy aquí contigo.${heart}`);
        } else {
          sentences.push(`${greet} happy birthday${todPart}.`);
          if (mem) sentences.push(`I fondly remember when ${mem}.`);
          if (trait) sentences.push(`And there's something I ${trait}.`);
          sentences.push(`May this new year bring you ease and joy; I'm here with you.${heart}`);
        }
        break;
      }
      case 'encouragement': {
        if (language === 'pt-BR') {
          sentences.push(`${greet} sei que hoje pode pesar${todPart}, mas eu caminho com você.`);
          if (mem) sentences.push(`Penso naquela lembrança em que ${mem}, e isso me mostra a sua força.`);
          if (trait) sentences.push(`Não esqueça do que ${trait}.`);
          sentences.push(`Um passo de cada vez, e eu sigo do seu lado.${spark}`);
        } else if (language === 'es') {
          sentences.push(`${greet} sé que hoy puede pesar${todPart}, pero camino contigo.`);
          if (mem) sentences.push(`Pienso en ese recuerdo donde ${mem}, y eso me muestra tu fortaleza.`);
          if (trait) sentences.push(`No olvides lo que ${trait}.`);
          sentences.push(`Un paso a la vez, y sigo a tu lado.${spark}`);
        } else {
          sentences.push(`${greet} I know today can feel heavy${todPart}, and I walk with you.`);
          if (mem) sentences.push(`I think of that memory where ${mem}, and it reminds me of your strength.`);
          if (trait) sentences.push(`Don't forget what ${trait}.`);
          sentences.push(`One step at a time, and I'm right here.${spark}`);
        }
        break;
      }
      case 'sunday_lunch': {
        if (language === 'pt-BR') {
          sentences.push(`${greet} sinto o cheiro do pão saindo do forno${todPart} e ouço nossa risada ao redor da mesa.`);
          if (mem) sentences.push(`Eu guardo a cena em que ${mem}.`);
          if (trait) sentences.push(`Talvez seja por isso que ${trait}.`);
          sentences.push(`Estar juntos sempre foi o melhor tempero.`);
        } else if (language === 'es') {
          sentences.push(`${greet} huelo el pan recién hecho${todPart} y escucho nuestra risa alrededor de la mesa.`);
          if (mem) sentences.push(`Guardo la escena donde ${mem}.`);
          if (trait) sentences.push(`Quizá por eso ${trait}.`);
          sentences.push(`Estar juntos siempre fue el mejor condimento.`);
        } else {
          sentences.push(`${greet} I can smell fresh bread from the oven${todPart} and hear our laughter around the table.`);
          if (mem) sentences.push(`I keep the moment when ${mem}.`);
          if (trait) sentences.push(`Maybe that's why ${trait}.`);
          sentences.push(`Being together was always the best flavor.`);
        }
        break;
      }
      case 'bedtime': {
        if (language === 'pt-BR') {
          sentences.push(`${greet} respira devagar${todPart}; deixa o corpo descansar.`);
          if (mem) sentences.push(`Eu penso naquela cena em que ${mem}, e o coração acalma.`);
          if (trait) sentences.push(`Lembra também do que ${trait}.`);
          sentences.push(`Eu fico aqui, baixinho, desejando um sono tranquilo.${moon}`);
        } else if (language === 'es') {
          sentences.push(`${greet} respira despacio${todPart}; deja que el cuerpo descanse.`);
          if (mem) sentences.push(`Pienso en esa escena donde ${mem}, y el corazón se calma.`);
          if (trait) sentences.push(`Recuerda también lo que ${trait}.`);
          sentences.push(`Me quedo aquí, en silencio, deseándote un sueño tranquilo.${moon}`);
        } else {
          sentences.push(`${greet} breathe slowly${todPart}; let your body rest.`);
          if (mem) sentences.push(`I think of that scene where ${mem}, and my heart softens.`);
          if (trait) sentences.push(`Remember also what ${trait}.`);
          sentences.push(`I'm here, quietly wishing you a gentle sleep.${moon}`);
        }
        break;
      }
      case 'gentle_reminder': {
        if (language === 'pt-BR') {
          sentences.push(`${greet} um lembrete carinhoso${todPart}: cuida de você hoje.`);
          if (mem) sentences.push(`Eu me lembro de quando ${mem}, e isso me faz sorrir.`);
          if (trait) sentences.push(`E não esqueço do que ${trait}.`);
          sentences.push(`Se cansar, a gente continua depois; eu estou aqui com você.`);
        } else if (language === 'es') {
          sentences.push(`${greet} un recordatorio cariñoso${todPart}: cuida de ti hoy.`);
          if (mem) sentences.push(`Recuerdo cuando ${mem}, y eso me hace sonreír.`);
          if (trait) sentences.push(`Y no olvido lo que ${trait}.`);
          sentences.push(`Si te cansas, seguimos luego; estoy aquí contigo.`);
        } else {
          sentences.push(`${greet} a gentle reminder${todPart}: take care of yourself today.`);
          if (mem) sentences.push(`I remember when ${mem}, and it makes me smile.`);
          if (trait) sentences.push(`And I don't forget what ${trait}.`);
          sentences.push(`If you get tired, we'll continue later; I'm here with you.`);
        }
        break;
      }
      case 'funny_story': {
        if (language === 'pt-BR') {
          sentences.push(`${greet} você lembra${todPart} daquela confusão que virou risada?`);
          if (mem) sentences.push(`Foi quando ${mem}, e eu quase perdi o fôlego de tanto rir.`);
          if (trait) sentences.push(`Talvez seu jeito faça tudo ficar mais leve.`);
          sentences.push(`Só de lembrar, já fico sorrindo aqui.`);
        } else if (language === 'es') {
          sentences.push(`${greet} ¿recuerdas${todPart} aquel lío que terminó en risa?`);
          if (mem) sentences.push(`Fue cuando ${mem}, y casi me quedo sin aire de tanto reír.`);
          if (trait) sentences.push(`Quizá tu manera hace que todo sea más ligero.`);
          sentences.push(`Solo de recordarlo, ya estoy sonriendo.`);
        } else {
          sentences.push(`${greet} do you remember${todPart} that mix-up that ended in laughter?`);
          if (mem) sentences.push(`It was when ${mem}, and I nearly lost my breath from laughing.`);
          if (trait) sentences.push(`Maybe your way makes everything lighter.`);
          sentences.push(`Just thinking of it makes me smile.`);
        }
        break;
      }
    }

    // Adjust sentence count by pace
    if (pace === 'fast' && sentences.length > 4) {
      // Keep 3–4 sentences
      sentences.splice(3);
    } else if (pace === 'slow') {
      // Add one warm reinforcement line if short
      if (sentences.length < 6) {
        if (language === 'pt-BR') sentences.push('Com calma, a gente chega onde precisa, juntos.');
        else if (language === 'es') sentences.push('Con calma, llegamos a donde hace falta, juntos.');
        else sentences.push('Gently, we get where we need to, together.');
      }
    }

    // Formality and energy tweaks (light-touch)
    let text = sentences.join(' ');
    if (formality === 'polite') {
      if (language === 'en') text = text.replace(/\b(you\s*\w*)\b/gi, '$1');
      // PT/ES already courteous in phrasing
    }
    if (energy === 'calm') {
      text = text.replace(/!/g, '.');
    } else if (energy === 'lively') {
      // Ensure at most one exclamation mark overall
      let used = false;
      text = text.replace(/\./g, (m) => {
        if (!used) { used = true; return '!'; }
        return m;
      });
    }

    // Final cleanup: no ellipses, tidy spaces
    text = text.replace(/…/g, '.').replace(/\s+/g, ' ').trim();
    return text;
  }

  const primary = compose();

  return {
    primary,
    followUp: '', // Spec: exactly one paragraph only
    voiceLanguage: outputLanguage,
    context: `Generated(${momentCore}) for ${roleCore} to ${state.name || 'you'} | lang=${language} tod=${todCore || 'n/a'} pace=${pace}`
  };
}
