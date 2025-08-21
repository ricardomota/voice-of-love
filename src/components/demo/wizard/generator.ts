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

// Map enums to standardized values
const mapEnum = (v?: string) => {
  if (!v) return "";
  const x = v.trim().toLowerCase();
  const dict: Record<string,string> = {
    "mãe":"mother","pai":"father","vovó":"grandma","vovô":"grandpa",
    "parceiro":"partner","parceira":"partner","parceiro(a)":"partner",
    "amigo":"friend","amiga":"friend","amigo(a)":"friend","outro":"other",
    "mother":"mother","father":"father","grandma":"grandma","grandpa":"grandpa",
    "partner":"partner","friend":"friend","other":"other",
    "mensagem de aniversário":"birthday","palavras de encorajamento":"encouragement",
    "memória do almoço de domingo":"sunday_lunch","história para dormir":"bedtime",
    "lembrete carinhoso":"gentle_reminder","uma história engraçada":"funny_story",
    "birthday":"birthday","encouragement":"encouragement",
    "sunday lunch memory":"sunday_lunch","bedtime story":"bedtime",
    "gentle reminder":"gentle_reminder","funny story":"funny_story",
    "manhã":"morning","tarde":"afternoon","noite":"night",
    "morning":"morning","afternoon":"afternoon","night":"night",
    "carinhoso":"affectionate","equilibrado":"balanced","direto":"direct",
    "affectionate":"affectionate","balanced":"balanced","direct":"direct",
    "casual":"casual","neutro":"neutral","educado":"polite",
    "neutral":"neutral","polite":"polite",
    "calmo":"calm","animado":"lively",
    "calm":"calm","lively":"lively","balanced":"balanced",
    "devagar":"slow","normal":"normal","rápido":"fast","fast":"fast"
  };
  return dict[x] ?? v;
};

// Convert memory from third person to first person addressing listener
const toFirstPerson = (lang: string, roleCore: string, text?: string) => {
  if (!text) return "";
  if (!["mother","father","grandma","grandpa","partner","friend"].includes(roleCore)) return text;
  
  let t = " " + text + " ";
  if (lang.toLowerCase().startsWith("pt")) {
    t = t.replace(/\b(minha|a minha)\s+m[ãa]e\b/gi, " eu ");
    t = t.replace(/\bela\b/gi, " eu ");
    t = t.replace(/\bminha escola\b/gi, "sua escola");
    t = t.replace(/\bme buscava\b/gi, "te buscava");
    t = t.replace(/\bme levava\b/gi, "te levava");
  } else if (lang.toLowerCase().startsWith("es")) {
    t = t.replace(/\b(mi|la)\s+mam[áa]\b/gi, " yo ");
    t = t.replace(/\bella\b/gi, " yo ");
    t = t.replace(/\bmi escuela\b/gi, "tu escuela");
    t = t.replace(/\bme recog[ií]a\b/gi, "te recogía");
  } else {
    t = t.replace(/\bmy mom\b/gi, " I ");
    t = t.replace(/\bshe\b/gi, " I ");
    t = t.replace(/\bmy school\b/gi, "your school");
    t = t.replace(/\bpicked me up\b/gi, "picked you up");
  }
  return t.replace(/\s{2,}/g, " ").trim();
};

export function generatePreviewText(state: DemoState, language: Language = 'en') {
  const outputLanguage = getLanguageCode(language);
  
  // Preprocess data
  const roleCore = mapEnum(state.relationship);
  const momentCore = mapEnum(state.topic);
  const todCore = mapEnum(state.personalization?.preferredTime);
  const favorite_memory = toFirstPerson(outputLanguage, roleCore, state.personalization?.favoriteMemory);
  const special_trait = (state.personalization?.personalDetail || "").replace(/^["""']|["""']$/g, "");
  const nickname = (state.name || "").trim();
  
  // Generate greeting
  const greeting = (() => {
    if (nickname && language === 'pt-BR') return `Oi ${nickname}, `;
    if (nickname) return `${nickname}, `;
    if (language === 'pt-BR') return 'Meu amor, ';
    if (language === 'es') return 'Mi amor, ';
    return 'My love, ';
  })();

  // Generate time of day phrase
  const timePhrase = (() => {
    if (!todCore) return '';
    if (language === 'pt-BR') {
      return todCore === 'morning' ? 'de manhã' : 
             todCore === 'afternoon' ? 'à tarde' : 'esta noite';
    }
    if (language === 'es') {
      return todCore === 'morning' ? 'por la mañana' : 
             todCore === 'afternoon' ? 'esta tarde' : 'esta noche';
    }
    return todCore === 'morning' ? 'this morning' : 
           todCore === 'afternoon' ? 'this afternoon' : 'tonight';
  })();

  // Generate based on moment type
  let message = '';
  const todPart = timePhrase ? ` ${timePhrase}` : '';
  
  if (momentCore === 'gentle_reminder') {
    if (language === 'pt-BR') {
      message = `${greeting}um lembrete carinhoso${todPart}: cuida de você hoje.`;
      if (favorite_memory) message += ` Eu me lembro de quando ${favorite_memory}, e isso me faz sorrir.`;
      if (special_trait) message += ` E não esqueço do que ${special_trait}.`;
      message += ` Se cansar, a gente continua depois; eu estou aqui com você.`;
    } else if (language === 'es') {
      message = `${greeting}un recordatorio cariñoso${todPart}: cuida de ti hoy.`;
      if (favorite_memory) message += ` Recuerdo cuando ${favorite_memory}, y eso me hace sonreír.`;
      if (special_trait) message += ` Y no olvido lo que ${special_trait}.`;
      message += ` Si te cansas, seguimos luego; estoy aquí contigo.`;
    } else {
      message = `${greeting}a gentle reminder${todPart}: take care of yourself today.`;
      if (favorite_memory) message += ` I remember when ${favorite_memory}, and it makes me smile.`;
      if (special_trait) message += ` And I don't forget what ${special_trait}.`;
      message += ` If you get tired, we'll continue later; I'm here with you.`;
    }
  } else {
    // Default encouragement message
    if (language === 'pt-BR') {
      message = `${greeting}sei que hoje pode pesar${todPart}, mas eu caminho com você.`;
      if (favorite_memory) message += ` Penso naquela lembrança em que ${favorite_memory}, e isso me mostra a sua força.`;
      message += ` Um passo de cada vez, e eu sigo do seu lado. ✨`;
    } else if (language === 'es') {
      message = `${greeting}sé que hoy puede pesar${todPart}, pero camino contigo.`;
      if (favorite_memory) message += ` Pienso en ese recuerdo donde ${favorite_memory}, y eso me muestra tu fortaleza.`;
      message += ` Un paso a la vez, y sigo a tu lado. ✨`;
    } else {
      message = `${greeting}I know today can feel heavy${todPart}, and I walk with you.`;
      if (favorite_memory) message += ` I think of that memory where ${favorite_memory}, and it reminds me of your strength.`;
      message += ` One step at a time, and I'm right here. ✨`;
    }
  }

  // Clean up message
  message = message.replace(/\s{2,}/g, ' ').trim();

  return {
    primary: message,
    followUp: '',
    voiceLanguage: outputLanguage,
    context: `Generated(${momentCore}) for ${roleCore} to ${state.name || 'you'} | lang=${language}`
  };
}