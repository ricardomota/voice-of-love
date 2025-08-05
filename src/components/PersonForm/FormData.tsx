import { Memory } from '@/types/person';

export interface FormData {
  name: string;
  relationship: string;
  howTheyCalledYou: string;
  birthYear: string;
  birthDate: string; // Data completa de nascimento
  avatar: string;
  memories: Memory[];
  personality: string[];
  commonPhrases: string[];
  temperature: number;
  talkingStyle: string;
  humorStyle: string;
  emotionalTone: string;
  verbosity: string;
  values: string[];
  topics: string[];
  voiceRecording: Blob | null;
  voiceDuration: number;
  voiceSettings?: {
    hasRecording: boolean;
    voiceId?: string;
  };
}

export const getInitialFormData = (): FormData => ({
  name: "",
  relationship: "",
  howTheyCalledYou: "",
  birthYear: "",
  birthDate: "",
  avatar: "",
  memories: [{ id: "memory-1", text: "", mediaUrl: "", mediaType: undefined, fileName: "" }],
  personality: [""],
  commonPhrases: [""],
  temperature: 0.7,
  talkingStyle: "",
  humorStyle: "",
  emotionalTone: "",
  verbosity: "",
  values: [""],
  topics: [""],
  voiceRecording: null,
  voiceDuration: 0,
  voiceSettings: { hasRecording: false }
});

export const getRelationshipPhrase = (relationship: string, name: string = ""): string => {
  const phrases = {
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
      "Vovós são anjos na Terra, não é mesmo? 👵💕",
      "Que tesouro é ter uma avó assim! 🌺",
      "O carinho de vó é o mais puro que existe. ✨",
      "Suas histórias devem ser incríveis! 📚"
    ],
    "Avô": [
      "Vovôs são sábios cheios de amor! 👴💙",
      "Que sorte ter um avô tão especial! 🌟",
      "Os conselhos dele são preciosos, né? 💎",
      "Que homem incrível deve ser! ⭐"
    ],
    "Irmã": [
      "Irmãs são amigas para a vida toda! 👭💕",
      "Que cumplicidade linda vocês têm! ✨",
      "Irmãs entendem a gente como ninguém. 💖",
      "Vocês devem ter muitas memórias juntas! 🌈"
    ],
    "Irmão": [
      "Irmãos são companheiros de todas as aventuras! 👬",
      "Que parceria especial vocês formam! 💙",
      "Irmão é amigo que a vida nos dá. ⭐",
      "Vocês devem se divertir muito juntos! 🎉"
    ],
    "Filha": [
      "Que orgulho você deve ter dessa filha! 👩‍👧💕",
      "O amor por uma filha é infinito. ✨",
      "Ela deve ser sua alegria maior! 🌟",
      "Que benção ter uma filha assim! 💖"
    ],
    "Filho": [
      "Que orgulho você deve ter desse filho! 👨‍👦💙",
      "O amor por um filho não tem limites. ⭐",
      "Ele deve ser sua maior conquista! 🏆",
      "Que alegria ter um filho assim! 🌟"
    ],
    "Esposa": [
      "Que amor lindo vocês compartilham! 💑💕",
      "Sua companheira de todas as horas. ✨",
      "Vocês formam uma dupla perfeita! 💖",
      "Que sorte encontrar um amor assim! 🌹"
    ],
    "Marido": [
      "Que parceria linda vocês têm! 💑💙",
      "Seu companheiro de todas as aventuras. ⭐",
      "Vocês são almas gêmeas! 💖",
      "Que benção ter um amor assim! 🌟"
    ],
    "Amiga": [
      "Amigas verdadeiras são tesouros raros! 👭✨",
      "Que amizade especial vocês têm! 💕",
      "Amigas como ela são para sempre! 🌟",
      "Vocês devem ter mil histórias juntas! 💖"
    ],
    "Amigo": [
      "Amigos de verdade são família que escolhemos! 👬💙",
      "Que amizade incrível vocês cultivam! ⭐",
      "Amigos assim são preciosos! 💎",
      "Vocês devem ter muitas aventuras! 🎉"
    ],
    "Tia": [
      "Tias são mães do coração! 👩‍👧💕",
      "Que tia especial você tem! ✨",
      "O carinho de tia é único! 🌺",
      "Ela deve ser muito querida! 💖"
    ],
    "Tio": [
      "Tios são pais emprestados! 👨‍👦💙",
      "Que tio incrível você tem! ⭐",
      "Tios fazem a família mais divertida! 🎉",
      "Ele deve ser muito especial! 🌟"
    ]
  };

  const relationshipPhrases = phrases[relationship as keyof typeof phrases] || [
    "Que vínculo especial vocês têm! ✨",
    "Pessoas assim marcam nossa vida para sempre! 💖"
  ];

  // Gera um índice baseado no nome e horário para ter variação mas consistência
  const seed = (name + relationship + Math.floor(Date.now() / (1000 * 60 * 10))).length;
  const index = seed % relationshipPhrases.length;
  
  return relationshipPhrases[index];
};

export const relationships = [
  "Mãe", "Pai", "Avó", "Avô", "Irmã", "Irmão", 
  "Filha", "Filho", "Esposa", "Marido", "Amiga", "Amigo", "Tia", "Tio"
];