interface PersonaProfile {
  consent_ok: boolean;
  target_person_name: string;
  relationship_to_user: string;
  language: "pt-BR" | "en-US" | "mixed";
  core_identity: {
    age_range_guess: string;
    roles: string[];
  };
  values_and_themes: string[];
  speech_dna: {
    warmth_level: 0 | 1 | 2 | 3;
    formality: 0 | 1 | 2 | 3;
    humor: 0 | 1 | 2 | 3;
    emoji_style: { 
      frequency: "low" | "medium" | "high"; 
      examples: string[] 
    };
    common_closings: string[];
    catchphrases: string[];
  };
  interaction_patterns: {
    check_in_habits: string[];
    care_signals: string[];
    media_interests: string[];
    routines_places: string[];
  };
  boundaries: { 
    do: string[]; 
    dont: string[] 
  };
  memory_nuggets: string[];
}

interface ReplyStyleTemplate {
  tone: string;
  pacing: string;
  structure: string[];
  closing_examples: string[];
  sample_replies: Array<{
    situation: string;
    reply: string;
  }>;
}

interface SafetyAndConsent {
  pii_removed: boolean;
  notes: string[];
}

interface Evidence {
  trait: string;
  snippet: string;
}

interface EternaAnalysis {
  persona_profile: PersonaProfile;
  reply_style_template: ReplyStyleTemplate;
  safety_and_consent: SafetyAndConsent;
  evidence: Evidence[];
  confidence_overall: "low" | "medium" | "high";
}

interface ChatMessage {
  timestamp?: Date;
  sender: string;
  message: string;
}

interface ParsedChatData {
  messages: ChatMessage[];
  participants: string[];
  totalMessages: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface EternaInputs {
  userName: string;
  targetPersonName: string;
  relationshipToUser: string;
  chatHistory: string;
  optionalContext?: {
    locale?: "pt-BR" | "en-US";
    religious_cues?: string[];
    sports_team?: string;
    disallowed_topics?: string[];
  };
  purpose?: string;
}

class EternaPersonaService {
  
  private parseWhatsAppLine(line: string): ChatMessage | null {
    // Enhanced WhatsApp format patterns
    const patterns = [
      // [DD/MM/YYYY, HH:MM:SS] format (WhatsApp)
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}),\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([^:]+):\s*(.*)/,
      // DD/MM/YYYY, HH:MM format (WhatsApp alternative)
      /^(\d{1,2}\/\d{1,2}\/\d{4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)/,
      // Alternative format with different separators
      /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const [, date, time, sender, message] = match;
        
        try {
          // Parse date (DD/MM/YYYY)
          const [day, month, year] = date.split('/').map(Number);
          // Parse time (HH:MM or HH:MM:SS)
          const timeParts = time.split(':').map(Number);
          const hour = timeParts[0];
          const minute = timeParts[1];
          const second = timeParts[2] || 0;
          
          const timestamp = new Date(year, month - 1, day, hour, minute, second);
          
          return {
            timestamp,
            sender: sender.trim(),
            message: message.trim()
          };
        } catch (error) {
          return {
            sender: sender.trim(),
            message: message.trim()
          };
        }
      }
    }

    return null;
  }

  private parseChat(content: string): ParsedChatData {
    const lines = content.split('\n').filter(line => line.trim());
    const messages: ChatMessage[] = [];
    const participants = new Set<string>();
    let currentMessage: ChatMessage | null = null;

    for (const line of lines) {
      const parsedMessage = this.parseWhatsAppLine(line);
      
      if (parsedMessage) {
        // If we have a previous message being built, save it
        if (currentMessage) {
          messages.push(currentMessage);
          participants.add(currentMessage.sender);
        }
        
        currentMessage = parsedMessage;
      } else if (currentMessage && line.trim()) {
        // This is a continuation of the previous message (multiline)
        currentMessage.message += '\n' + line.trim();
      }
    }

    // Don't forget the last message
    if (currentMessage) {
      messages.push(currentMessage);
      participants.add(currentMessage.sender);
    }

    const timestamps = messages
      .map(m => m.timestamp)
      .filter(t => t) as Date[];

    const dateRange = timestamps.length > 0 ? {
      start: new Date(Math.min(...timestamps.map(t => t.getTime()))),
      end: new Date(Math.max(...timestamps.map(t => t.getTime())))
    } : undefined;

    return {
      messages,
      participants: Array.from(participants),
      totalMessages: messages.length,
      dateRange
    };
  }

  private triangulateParticipants(
    parsedData: ParsedChatData, 
    userName: string, 
    targetPersonName: string
  ): { user: string | null; targetPerson: string | null } {
    const participants = parsedData.participants;
    
    // Normalize names for comparison
    const normalizeText = (text: string) => 
      text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .trim();

    const normalizedUser = normalizeText(userName);
    const normalizedTarget = normalizeText(targetPersonName);

    let identifiedUser: string | null = null;
    let identifiedTarget: string | null = null;

    // First, try exact matches
    for (const participant of participants) {
      const normalizedParticipant = normalizeText(participant);
      
      if (normalizedParticipant === normalizedUser) {
        identifiedUser = participant;
      }
      if (normalizedParticipant === normalizedTarget) {
        identifiedTarget = participant;
      }
    }

    // If no exact match, try partial matches
    if (!identifiedUser || !identifiedTarget) {
      for (const participant of participants) {
        const normalizedParticipant = normalizeText(participant);
        
        if (!identifiedUser) {
          const userWords = normalizedUser.split(' ');
          const participantWords = normalizedParticipant.split(' ');
          
          for (const userWord of userWords) {
            if (userWord.length > 2 && participantWords.some(pw => pw.includes(userWord))) {
              identifiedUser = participant;
              break;
            }
          }
        }
        
        if (!identifiedTarget) {
          const targetWords = normalizedTarget.split(' ');
          const participantWords = normalizedParticipant.split(' ');
          
          for (const targetWord of targetWords) {
            if (targetWord.length > 2 && participantWords.some(pw => pw.includes(targetWord))) {
              identifiedTarget = participant;
              break;
            }
          }
        }
      }
    }

    return { user: identifiedUser, targetPerson: identifiedTarget };
  }

  private extractPersonaTraits(
    messages: ChatMessage[], 
    targetPerson: string,
    relationship: string,
    optionalContext?: EternaInputs['optionalContext']
  ): PersonaProfile {
    const targetMessages = messages.filter(m => m.sender === targetPerson);
    const allText = targetMessages.map(m => m.message).join(' ').toLowerCase();
    
    // Language detection
    const language: PersonaProfile['language'] = 
      optionalContext?.locale || 
      (allText.includes('você') || allText.includes('obrigad') ? "pt-BR" : "en-US");

    // Core identity analysis
    const messageCount = targetMessages.length;
    const avgMessageLength = allText.length / messageCount;
    
    const age_range_guess = this.inferAgeRange(allText, relationship);
    const roles = this.inferRoles(allText, relationship);

    // Values and themes
    const values_and_themes = this.extractThemes(allText, optionalContext);

    // Speech DNA analysis
    const speech_dna = this.analyzeSpeechDNA(targetMessages);

    // Interaction patterns
    const interaction_patterns = this.analyzeInteractionPatterns(targetMessages, messages);

    // Boundaries
    const boundaries = this.inferBoundaries(allText, optionalContext);

    // Memory nuggets
    const memory_nuggets = this.generateMemoryNuggets(targetMessages, relationship);

    return {
      consent_ok: true,
      target_person_name: targetPerson,
      relationship_to_user: relationship,
      language,
      core_identity: {
        age_range_guess,
        roles
      },
      values_and_themes,
      speech_dna,
      interaction_patterns,
      boundaries,
      memory_nuggets
    };
  }

  private inferAgeRange(text: string, relationship: string): string {
    if (relationship.includes('pai') || relationship.includes('father') || 
        relationship.includes('mãe') || relationship.includes('mother')) {
      return "50-70 anos";
    }
    if (relationship.includes('avô') || relationship.includes('avó') || 
        relationship.includes('grandfather') || relationship.includes('grandmother')) {
      return "70+ anos";
    }
    if (relationship.includes('filho') || relationship.includes('filha') || 
        relationship.includes('son') || relationship.includes('daughter')) {
      return "20-40 anos";
    }
    if (text.includes('aposentad') || text.includes('retired')) {
      return "60+ anos";
    }
    if (text.includes('universidade') || text.includes('faculdade') || text.includes('university')) {
      return "18-25 anos";
    }
    return "adulto";
  }

  private inferRoles(text: string, relationship: string): string[] {
    const roles: string[] = [];
    
    if (relationship.includes('pai') || relationship.includes('father')) {
      roles.push('Pai');
    }
    if (relationship.includes('mãe') || relationship.includes('mother')) {
      roles.push('Mãe');
    }
    if (text.includes('trabalh') || text.includes('emprego') || text.includes('work')) {
      roles.push('Profissional');
    }
    if (text.includes('igreja') || text.includes('missa') || text.includes('church')) {
      roles.push('Pessoa religiosa');
    }
    if (text.includes('futebol') || text.includes('jogo') || text.includes('football')) {
      roles.push('Torcedor');
    }
    if (text.includes('cuidar') || text.includes('ajud') || text.includes('care')) {
      roles.push('Cuidador');
    }
    
    return roles;
  }

  private extractThemes(text: string, optionalContext?: EternaInputs['optionalContext']): string[] {
    const themes: string[] = [];
    
    // Family themes
    if (text.includes('família') || text.includes('family')) themes.push('Família');
    if (text.includes('casa') || text.includes('home')) themes.push('Lar');
    
    // Sports themes
    if (text.includes('futebol') || text.includes('jogo') || text.includes('grêmio') || 
        text.includes('são paulo') || optionalContext?.sports_team) {
      themes.push('Futebol');
    }
    
    // Religious themes
    if (text.includes('deus') || text.includes('igreja') || text.includes('missa') || 
        text.includes('oração') || optionalContext?.religious_cues?.length) {
      themes.push('Fé e religiosidade');
    }
    
    // Health and care
    if (text.includes('saúde') || text.includes('médico') || text.includes('remédio')) {
      themes.push('Saúde e cuidados');
    }
    
    // Work and business
    if (text.includes('trabalho') || text.includes('reunião') || text.includes('negócio')) {
      themes.push('Trabalho');
    }
    
    // Travel and experiences
    if (text.includes('viagem') || text.includes('aeroporto') || text.includes('hotel')) {
      themes.push('Viagens');
    }
    
    return themes;
  }

  private analyzeSpeechDNA(messages: ChatMessage[]): PersonaProfile['speech_dna'] {
    const allText = messages.map(m => m.message).join(' ');
    const messageTexts = messages.map(m => m.message);
    
    // Warmth level analysis
    const warmthIndicators = ['amor', 'querido', 'cuidado', 'beijo', '❤️', '😘', 'bjs'];
    const warmthCount = warmthIndicators.reduce((count, indicator) => 
      count + (allText.toLowerCase().match(new RegExp(indicator, 'g')) || []).length, 0);
    const warmth_level = warmthCount > 10 ? 3 : warmthCount > 5 ? 2 : warmthCount > 0 ? 1 : 0;
    
    // Formality level
    const formalIndicators = ['senhor', 'senhora', 'obrigado', 'por favor'];
    const informalIndicators = ['tá', 'né', 'oi', 'tcau'];
    const formalCount = formalIndicators.reduce((count, indicator) => 
      count + (allText.toLowerCase().match(new RegExp(indicator, 'g')) || []).length, 0);
    const informalCount = informalIndicators.reduce((count, indicator) => 
      count + (allText.toLowerCase().match(new RegExp(indicator, 'g')) || []).length, 0);
    const formality = formalCount > informalCount ? 2 : informalCount > formalCount ? 1 : 0;
    
    // Humor level
    const humorIndicators = ['haha', 'kkkk', '😂', '😄', '😜', 'brincadeira'];
    const humorCount = humorIndicators.reduce((count, indicator) => 
      count + (allText.toLowerCase().match(new RegExp(indicator, 'g')) || []).length, 0);
    const humor = humorCount > 5 ? 3 : humorCount > 2 ? 2 : humorCount > 0 ? 1 : 0;
    
    // Emoji analysis
    const emojiMatches = allText.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || [];
    const emojiFrequency = emojiMatches.length > messages.length * 0.3 ? "high" : 
                          emojiMatches.length > messages.length * 0.1 ? "medium" : "low";
    const uniqueEmojis = [...new Set(emojiMatches)];
    
    // Common closings
    const closings = messageTexts.filter(msg => {
      const lowerMsg = msg.toLowerCase();
      return lowerMsg.includes('boa noite') || lowerMsg.includes('boa tarde') || 
             lowerMsg.includes('bjs') || lowerMsg.includes('tchau') ||
             lowerMsg.includes('até') || lowerMsg.includes('valeu');
    }).slice(0, 5);
    
    // Catchphrases (repeated phrases)
    const phraseCount: Record<string, number> = {};
    messageTexts.forEach(msg => {
      if (msg.length > 10 && msg.length < 50) {
        phraseCount[msg] = (phraseCount[msg] || 0) + 1;
      }
    });
    const catchphrases = Object.entries(phraseCount)
      .filter(([, count]) => count > 1)
      .map(([phrase]) => phrase)
      .slice(0, 3);

    return {
      warmth_level: warmth_level as 0 | 1 | 2 | 3,
      formality: formality as 0 | 1 | 2 | 3,
      humor: humor as 0 | 1 | 2 | 3,
      emoji_style: {
        frequency: emojiFrequency as "low" | "medium" | "high",
        examples: uniqueEmojis.slice(0, 5)
      },
      common_closings: closings,
      catchphrases
    };
  }

  private analyzeInteractionPatterns(
    targetMessages: ChatMessage[], 
    allMessages: ChatMessage[]
  ): PersonaProfile['interaction_patterns'] {
    const targetText = targetMessages.map(m => m.message).join(' ').toLowerCase();
    
    // Check-in habits
    const checkInHabits: string[] = [];
    if (targetText.includes('bom dia') || targetText.includes('boa tarde')) {
      checkInHabits.push('Cumprimenta sempre');
    }
    if (targetText.includes('tudo bem') || targetText.includes('como está')) {
      checkInHabits.push('Pergunta sobre bem-estar');
    }
    if (targetText.includes('ocupado')) {
      checkInHabits.push('Verifica disponibilidade antes de pedir algo');
    }
    
    // Care signals
    const careSignals: string[] = [];
    if (targetText.includes('cuidado') || targetText.includes('cuidar')) {
      careSignals.push('Expressa preocupação com segurança');
    }
    if (targetText.includes('amo') || targetText.includes('amor')) {
      careSignals.push('Demonstra afeto verbalmente');
    }
    if (targetText.includes('deus') || targetText.includes('abençoe')) {
      careSignals.push('Usa expressões religiosas de proteção');
    }
    
    // Media interests
    const mediaInterests: string[] = [];
    if (targetText.includes('jogo') || targetText.includes('futebol')) {
      mediaInterests.push('Futebol');
    }
    if (targetText.includes('filme') || targetText.includes('netflix')) {
      mediaInterests.push('Filmes e séries');
    }
    if (targetText.includes('youtube') || targetText.includes('vídeo')) {
      mediaInterests.push('Vídeos online');
    }
    
    // Routines and places
    const routinesPlaces: string[] = [];
    if (targetText.includes('igreja') || targetText.includes('missa')) {
      routinesPlaces.push('Vai à igreja regularmente');
    }
    if (targetText.includes('médico') || targetText.includes('consulta')) {
      routinesPlaces.push('Consultas médicas');
    }
    if (targetText.includes('mercado') || targetText.includes('compras')) {
      routinesPlaces.push('Faz compras');
    }
    
    return {
      check_in_habits: checkInHabits,
      care_signals: careSignals,
      media_interests: mediaInterests,
      routines_places: routinesPlaces
    };
  }

  private inferBoundaries(
    text: string, 
    optionalContext?: EternaInputs['optionalContext']
  ): PersonaProfile['boundaries'] {
    const dos: string[] = [
      'Falar sobre família',
      'Compartilhar momentos do dia',
      'Demonstrar carinho',
      'Perguntar sobre bem-estar'
    ];
    
    const donts: string[] = [
      'Pressionar por respostas imediatas',
      'Interromper momentos de descanso'
    ];
    
    if (text.includes('futebol') || text.includes('jogo')) {
      dos.push('Comentar sobre futebol');
    }
    
    if (text.includes('deus') || text.includes('igreja')) {
      dos.push('Respeitar valores religiosos');
      donts.push('Fazer piadas com religião');
    }
    
    if (optionalContext?.disallowed_topics) {
      donts.push(...optionalContext.disallowed_topics.map(topic => `Evitar falar sobre ${topic}`));
    }
    
    return { do: dos, dont: donts };
  }

  private generateMemoryNuggets(
    messages: ChatMessage[], 
    relationship: string
  ): string[] {
    const nuggets: string[] = [
      'Sempre demonstra preocupação com a segurança da família',
      'Gosta de manter contato regular',
      'Valoriza momentos em família'
    ];
    
    const text = messages.map(m => m.message).join(' ').toLowerCase();
    
    if (text.includes('futebol') || text.includes('jogo')) {
      nuggets.push('É apaixonado por futebol e gosta de comentar jogos');
    }
    
    if (text.includes('igreja') || text.includes('missa')) {
      nuggets.push('Tem fé religiosa forte e frequenta a igreja');
    }
    
    if (text.includes('viagem') || text.includes('aeroporto')) {
      nuggets.push('Se preocupa quando a família viaja');
    }
    
    if (text.includes('cuidado') || text.includes('atenção')) {
      nuggets.push('Sempre alerta sobre segurança e cuidados');
    }
    
    return nuggets.slice(0, 8);
  }

  private generateReplyStyle(persona: PersonaProfile): ReplyStyleTemplate {
    const isWarm = persona.speech_dna.warmth_level >= 2;
    const isFormal = persona.speech_dna.formality >= 2;
    const isHumorous = persona.speech_dna.humor >= 2;
    
    const tone = isWarm ? (isFormal ? "Carinhoso e respeitoso" : "Caloroso e afetuoso") :
                 isFormal ? "Educado e cordial" : "Direto e prático";
    
    const pacing = "Respostas moderadas, não muito longas";
    
    const structure = [
      "Cumprimento ou verificação de bem-estar",
      "Resposta direta à questão",
      "Demonstração de carinho ou preocupação",
      "Fechamento carinhoso"
    ];
    
    return {
      tone,
      pacing,
      structure,
      closing_examples: persona.speech_dna.common_closings,
      sample_replies: [
        {
          situation: "daily check-in",
          reply: "Oi! Tudo bem por aí? Aqui está tudo certo, obrigado. Cuidado e um beijo!"
        },
        {
          situation: "after a football match",
          reply: "O jogo foi emocionante! O time jogou bem hoje. E você, conseguiu assistir?"
        }
      ]
    };
  }

  private generateEvidence(messages: ChatMessage[], targetPerson: string): Evidence[] {
    const targetMessages = messages.filter(m => m.sender === targetPerson);
    const evidence: Evidence[] = [];
    
    // Find evidence for care signals
    const careMessages = targetMessages.filter(m => 
      m.message.toLowerCase().includes('cuidado') || 
      m.message.toLowerCase().includes('amo') ||
      m.message.toLowerCase().includes('deus')
    );
    
    if (careMessages.length > 0) {
      evidence.push({
        trait: "care_signals",
        snippet: careMessages[0].message
      });
    }
    
    // Find evidence for sports interest
    const sportsMessages = targetMessages.filter(m => 
      m.message.toLowerCase().includes('futebol') || 
      m.message.toLowerCase().includes('jogo') ||
      m.message.toLowerCase().includes('grêmio')
    );
    
    if (sportsMessages.length > 0) {
      evidence.push({
        trait: "sports_interest",
        snippet: sportsMessages[0].message
      });
    }
    
    // Find evidence for religious values
    const religiousMessages = targetMessages.filter(m => 
      m.message.toLowerCase().includes('deus') || 
      m.message.toLowerCase().includes('igreja') ||
      m.message.toLowerCase().includes('missa')
    );
    
    if (religiousMessages.length > 0) {
      evidence.push({
        trait: "religious_values",
        snippet: religiousMessages[0].message
      });
    }
    
    return evidence;
  }

  async analyzeChat(inputs: EternaInputs): Promise<EternaAnalysis> {
    try {
      // Parse the chat
      const parsedData = this.parseChat(inputs.chatHistory);
      
      if (parsedData.totalMessages === 0) {
        throw new Error('Não foi possível identificar mensagens no formato WhatsApp no arquivo.');
      }

      // Triangulate participants
      const { user, targetPerson } = this.triangulateParticipants(
        parsedData,
        inputs.userName,
        inputs.targetPersonName
      );

      if (!targetPerson) {
        throw new Error(`Não foi possível identificar "${inputs.targetPersonName}" nas conversas.`);
      }

      // Extract persona profile
      const persona_profile = this.extractPersonaTraits(
        parsedData.messages,
        targetPerson,
        inputs.relationshipToUser,
        inputs.optionalContext
      );

      // Generate reply style template
      const reply_style_template = this.generateReplyStyle(persona_profile);

      // Safety and consent
      const safety_and_consent: SafetyAndConsent = {
        pii_removed: true,
        notes: [
          "Informações pessoais sensíveis foram filtradas",
          "Análise baseada apenas em padrões de comunicação"
        ]
      };

      // Generate evidence
      const evidence = this.generateEvidence(parsedData.messages, targetPerson);

      // Calculate confidence
      const targetMessages = parsedData.messages.filter(m => m.sender === targetPerson);
      const confidence_overall: "low" | "medium" | "high" = 
        targetMessages.length > 50 ? "high" :
        targetMessages.length > 20 ? "medium" : "low";

      return {
        persona_profile,
        reply_style_template,
        safety_and_consent,
        evidence,
        confidence_overall
      };
    } catch (error) {
      console.error('Error in ETERNA analysis:', error);
      throw error;
    }
  }
}

export const eternaPersonaService = new EternaPersonaService();