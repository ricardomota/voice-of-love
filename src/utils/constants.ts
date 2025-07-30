export const RELATIONSHIPS = [
  "Mãe", "Pai", "Avó", "Avô", "Irmã", "Irmão", 
  "Filha", "Filho", "Esposa", "Marido", "Amiga", "Amigo", "Tia", "Tio"
] as const;

export const TALKING_STYLES = [
  "Carinhoso e afetuoso",
  "Direto e objetivo", 
  "Poético e reflexivo",
  "Engraçado e descontraído",
  "Sábio e conselheiro",
  "Energético e entusiasmado"
] as const;

export const HUMOR_STYLES = [
  "Irônico e sarcástico",
  "Doce e ingênuo",
  "Inteligente e perspicaz", 
  "Brincalhão e travesso",
  "Sutil e refinado",
  "Não tinha muito humor"
] as const;

export const EMOTIONAL_TONES = [
  "Sempre positivo e otimista",
  "Calmo e equilibrado",
  "Intenso e passionate",
  "Melancólico e nostálgico", 
  "Acolhedor e reconfortante",
  "Determinado e forte"
] as const;

export const VERBOSITY_LEVELS = [
  "Falava pouco, mas preciso",
  "Conversador e detalhista",
  "Direto e conciso",
  "Gostava de contar histórias longas"
] as const;

export const FILE_UPLOAD_CONFIG = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/quicktime'],
    audio: ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg']
  }
} as const;

export const RELATIONSHIP_PHRASES = {
  "Mãe": [
    "Que amor especial você tem com sua mãe! 💕",
    "O vínculo entre mãe e filho é único e eterno. ✨",
    "Sua mãe sempre será parte de quem você é. 🌟",
    "Que sorte ter uma mãe tão especial! 💖"
  ],
  "Pai": [
    "Que bela relação você tem com seu pai! 👨‍👧‍👦",
    "O amor de pai é uma força que nos guia sempre. 💙",
    "Seu pai é seu herói, não é? 🦸‍♂️",
    "Que orgulho ele deve ter de você! ⭐"
  ],
  "Avó": [
    "Avós são como estrelas que brilham para sempre. 👵💖",
    "O carinho de avó é um abraço que conforta a alma. 🥰",
    "Sua avó te ama mais do que as palavras podem dizer. 🌷",
    "Que bom ter uma avó tão querida em sua vida! 🌟"
  ],
  "Avô": [
    "Avôs são exemplos de sabedoria e amor. 👴💙",
    "O amor de avô é um porto seguro em qualquer tempestade. ⚓",
    "Seu avô sempre estará ao seu lado, te protegendo. 🌟",
    "Que alegria ter um avô tão especial! ⭐"
  ],
  "Irmã": [
    "Irmãs são amigas para sempre, unidas pelo coração. 👩‍❤️‍👩💖",
    "O laço entre irmãs é um presente precioso. 🎁",
    "Sua irmã é sua confidente e parceira. 👯‍♀️",
    "Que sorte ter uma irmã para compartilhar a vida! 🌟"
  ],
  "Irmão": [
    "Irmãos são companheiros de aventura e lealdade. 👦🤝👦",
    "O amor de irmão é um elo que nunca se rompe. 🔗",
    "Seu irmão é seu amigo e protetor. 🦸‍♂️",
    "Que legal ter um irmão para todas as horas! ⭐"
  ],
  "Filha": [
    "Filhas são a luz que ilumina nossos dias. 👧💖",
    "O amor de mãe para filha é infinito e incondicional. 💕",
    "Sua filha te admira e se inspira em você. 🌟",
    "Que bênção ter uma filha tão amada! 🌷"
  ],
  "Filho": [
    "Filhos são a herança mais valiosa que podemos deixar. 👦💙",
    "O amor de pai para filho é um legado eterno. 💫",
    "Seu filho te ama e te honra em cada passo. 🌟",
    "Que presente ter um filho tão especial! ⭐"
  ],
  "Esposa": [
    "Esposas são o coração do lar e a força da família. 👩‍❤️‍👨💖",
    "O amor entre vocês é um exemplo de cumplicidade e respeito. ✨",
    "Sua esposa te completa e te faz feliz. 🥰",
    "Que lindo ver o amor de vocês florescer a cada dia! 🌷"
  ],
  "Marido": [
    "Maridos são o alicerce da família e o porto seguro do lar. 👨‍👩‍👧‍👦💙",
    "O amor entre vocês é uma jornada de sonhos e conquistas. 🌟",
    "Seu marido te apoia e te ama incondicionalmente. 💖",
    "Que maravilhoso construir uma vida juntos! ⭐"
  ],
  "Amiga": [
    "Amigas são irmãs de alma que a vida nos presenteia. 👩‍❤️‍👩💖",
    "A amizade de vocês é um tesouro raro e valioso. 💎",
    "Sua amiga te conhece e te aceita como você é. 🥰",
    "Que alegria ter uma amiga para compartilhar todos os momentos! 🌷"
  ],
  "Amigo": [
    "Amigos são parceiros de risadas e confidentes leais. 👨‍🤝‍👨💙",
    "A amizade de vocês é um laço forte e duradouro. 💪",
    "Seu amigo te apoia e te incentiva a ser melhor. 🌟",
    "Que bom ter um amigo para todas as horas! ⭐"
  ],
  "Tia": [
    "Tias são como segundas mães, sempre prontas para amar e cuidar. 👩‍👧‍👦💖",
    "O carinho de tia é um abraço que acalma o coração. 🥰",
    "Sua tia te admira e se orgulha de você. 🌟",
    "Que especial ter uma tia tão querida em sua vida! 🌷"
  ],
  "Tio": [
    "Tios são como pais, sempre dispostos a ensinar e proteger. 👨‍👧‍👦💙",
    "O amor de tio é um guia que ilumina o caminho. 🌟",
    "Seu tio te incentiva a seguir seus sonhos e acreditar em si mesmo. ⭐",
    "Que sorte ter um tio tão presente e amado! 💖"
  ]
} as const;

export const FORM_STEPS = {
  INTRO: 0,
  BASIC_INFO: 1,
  RELATIONSHIP: 2,
  HOW_CALLED: 3,
  MEMORIES: 4,
  PERSONALITY: 5,
  TALKING_STYLE: 6,
  HUMOR_STYLE: 7,
  EMOTIONAL_TONE: 8,
  VERBOSITY: 9,
  VALUES: 10,
  TOPICS: 11,
  TEMPERATURE: 12,
  VOICE_RECORDING: 13,
  COMMON_PHRASES: 14
} as const;
