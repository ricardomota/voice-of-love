/**
 * Serviço para análise de transcrições de áudio
 * Extrai características de personalidade, frases comuns e estilos de fala
 */

export const transcriptionAnalysisService = {
  /**
   * Extrai frases características da transcrição
   */
  extractCharacteristicPhrases(text: string): string[] {
    const phrases: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Padrões expandidos para capturar mais expressões características
    const patterns = [
      // Cumprimentos e saudações
      /\b(oi|olá|e aí|eae|fala|beleza|bom dia|boa tarde|boa noite|paz|salve)\b/gi,
      // Despedidas
      /\b(tchau|até|falou|abraço|beijo|fique bem|até mais|até logo|vai com deus)\b/gi,
      // Expressões de surpresa/emoção
      /\b(nossa|meu deus|caramba|puxa|nossa senhora|ai meu deus|santa maria|jesus)\b/gi,
      // Confirmações e concordâncias
      /\b(né|não é|sabe|entende|viu|certo|exato|isso mesmo|claro|óbvio)\b/gi,
      // Tratamentos carinhosos
      /\b(meu filho|minha filha|filho|filha|querido|querida|amor|benzinho|coração)\b/gi,
      // Expressões regionais/características
      /\b(uai|sô|oxe|trem|negócio|bagulho|parada|massa|legal|bacana)\b/gi,
      // Frases completas comuns
      /(como você está|tudo bem|que bom|que legal|imagina só|pode crer|sem dúvida)/gi,
      // Expressões de carinho/preocupação
      /(se cuida|fica bem|com cuidado|deus te abençoe|que deus te proteja)/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleanMatch = match.trim();
          if (cleanMatch.length > 2 && !phrases.includes(cleanMatch)) {
            phrases.push(cleanMatch);
          }
        });
      }
    });
    
    // Também extrair frases mais longas e características
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      // Procurar por frases que contenham palavras-chave emocionais
      if ((trimmed.includes('sempre') || trimmed.includes('lembro') || 
           trimmed.includes('amor') || trimmed.includes('saudade') ||
           trimmed.includes('orgulho') || trimmed.includes('feliz')) &&
          trimmed.length < 100) {
        phrases.push(trimmed);
      }
    });
    
    return phrases.slice(0, 8); // Máximo 8 frases
  },

  /**
   * Analisa estilo de fala e retorna características
   */
  analyzeSpeechStyle(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Detectar formalidade
    if (lowerText.includes('senhor') || lowerText.includes('senhora') || 
        lowerText.includes('vossa') || lowerText.includes('pois não') ||
        lowerText.includes('com licença') || lowerText.includes('por favor') ||
        lowerText.includes('muito obrigado')) {
      return 'formal';
    }
    
    // Detectar informalidade jovem
    if (lowerText.includes('cara') || lowerText.includes('mano') || 
        lowerText.includes('véi') || lowerText.includes('brother') ||
        lowerText.includes('galera') || lowerText.includes('pessoal')) {
      return 'informal';
    }
    
    // Detectar carinho maternal/paternal
    if (lowerText.includes('amor') || lowerText.includes('querido') || 
        lowerText.includes('meu bem') || lowerText.includes('benzinho') ||
        lowerText.includes('coração') || lowerText.includes('meu filho') ||
        lowerText.includes('minha filha')) {
      return 'carinhoso';
    }
    
    // Detectar storytelling/narrativo
    if (lowerText.includes('era uma vez') || lowerText.includes('aconteceu') || 
        lowerText.includes('lembro que') || lowerText.includes('uma vez') ||
        lowerText.includes('você sabe que') || lowerText.includes('deixa eu te contar')) {
      return 'storyteller';
    }
    
    // Detectar estilo motivacional/conselheiro
    if (lowerText.includes('sempre digo') || lowerText.includes('acredite') ||
        lowerText.includes('nunca desista') || lowerText.includes('tenha fé') ||
        lowerText.includes('você consegue') || lowerText.includes('força')) {
      return 'motivacional';
    }
    
    // Detectar humor/brincalhão
    if (lowerText.includes('haha') || lowerText.includes('rsrs') ||
        lowerText.includes('que engraçado') || lowerText.includes('brincadeira') ||
        lowerText.includes('piada') || text.includes('😂') || text.includes('😄')) {
      return 'brincalhão';
    }
    
    return 'natural'; // Padrão
  },

  /**
   * Extrai traços de personalidade da transcrição
   */
  extractPersonalityTraits(text: string): string[] {
    const traits: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Detectar religiosidade
    if (lowerText.includes('deus') || lowerText.includes('jesus') || 
        lowerText.includes('oração') || lowerText.includes('igreja') ||
        lowerText.includes('fé') || lowerText.includes('abençoe')) {
      traits.push('Religioso(a)');
    }
    
    // Detectar otimismo
    if (lowerText.includes('sempre bom') || lowerText.includes('tudo vai dar certo') ||
        lowerText.includes('positivo') || lowerText.includes('esperança') ||
        lowerText.includes('vai ficar bem')) {
      traits.push('Otimista');
    }
    
    // Detectar preocupação/cuidado
    if (lowerText.includes('se cuida') || lowerText.includes('cuidado') ||
        lowerText.includes('preocupo') || lowerText.includes('atenção') ||
        lowerText.includes('tem cuidado')) {
      traits.push('Cuidadoso(a)');
    }
    
    // Detectar sabedoria/experiência
    if (lowerText.includes('experiência') || lowerText.includes('aprendi') ||
        lowerText.includes('vida ensina') || lowerText.includes('com o tempo') ||
        lowerText.includes('já vi muito')) {
      traits.push('Sábio(a)');
    }
    
    // Detectar carinho familiar
    if (lowerText.includes('família') || lowerText.includes('filhos') ||
        lowerText.includes('netos') || lowerText.includes('casa') ||
        lowerText.includes('lar')) {
      traits.push('Familiar');
    }
    
    return traits;
  },

  /**
   * Extrai valores e tópicos favoritos
   */
  extractValuesAndTopics(text: string): { values: string[], topics: string[] } {
    const lowerText = text.toLowerCase();
    const values: string[] = [];
    const topics: string[] = [];
    
    // Valores detectados
    if (lowerText.includes('honestidade') || lowerText.includes('verdade') ||
        lowerText.includes('honesto') || lowerText.includes('sincero')) {
      values.push('Honestidade');
    }
    if (lowerText.includes('família') || lowerText.includes('unidos') ||
        lowerText.includes('juntos') || lowerText.includes('parentes')) {
      values.push('Família');
    }
    if (lowerText.includes('trabalho') || lowerText.includes('esforço') ||
        lowerText.includes('dedicação') || lowerText.includes('batalha')) {
      values.push('Trabalho');
    }
    if (lowerText.includes('estudar') || lowerText.includes('aprender') ||
        lowerText.includes('conhecimento') || lowerText.includes('escola')) {
      values.push('Educação');
    }
    
    // Tópicos favoritos detectados
    if (lowerText.includes('comida') || lowerText.includes('cozinha') ||
        lowerText.includes('receita') || lowerText.includes('cozinhar')) {
      topics.push('Culinária');
    }
    if (lowerText.includes('viagem') || lowerText.includes('lugar') ||
        lowerText.includes('cidade') || lowerText.includes('passear')) {
      topics.push('Viagens');
    }
    if (lowerText.includes('música') || lowerText.includes('cantar') ||
        lowerText.includes('canção') || lowerText.includes('rádio')) {
      topics.push('Música');
    }
    if (lowerText.includes('saúde') || lowerText.includes('médico') ||
        lowerText.includes('remédio') || lowerText.includes('exercício')) {
      topics.push('Saúde');
    }
    
    return { values, topics };
  },

  /**
   * Determina gênero baseado no relacionamento
   */
  getGender(relationship: string): 'male' | 'female' | 'neutral' {
    const masculineRelationships = [
      'pai', 'papai', 'paizinho', 'padrasto', 'vovô', 'avô', 'vovozinho', 
      'irmão', 'irmãozinho', 'meio-irmão', 'marido', 'esposo', 'namorado', 
      'noivo', 'filho', 'filhinho', 'enteado', 'neto', 'netinho', 'tio', 
      'tiozinho', 'padrinho', 'primo', 'priminho', 'cunhado', 'sogro', 
      'genro', 'bisavô', 'sobrinho', 'afilhado'
    ];
    
    const femininRelationships = [
      'mãe', 'mamãe', 'mãezinha', 'madrasta', 'vovó', 'avó', 'vovozinha',
      'irmã', 'irmãzinha', 'meia-irmã', 'esposa', 'mulher', 'namorada',
      'noiva', 'filha', 'filhinha', 'enteada', 'neta', 'netinha', 'tia',
      'tiazinha', 'madrinha', 'prima', 'priminha', 'cunhada', 'sogra',
      'nora', 'bisavó', 'sobrinha', 'afilhada'
    ];

    const lowerRelationship = relationship.toLowerCase();
    
    if (masculineRelationships.some(rel => lowerRelationship.includes(rel))) {
      return 'male';
    }
    if (femininRelationships.some(rel => lowerRelationship.includes(rel))) {
      return 'female';
    }
    return 'neutral';
  },

  /**
   * Retorna pronomes baseados no gênero
   */
  getPronouns(gender: 'male' | 'female' | 'neutral') {
    switch (gender) {
      case 'male':
        return {
          subject: 'ele',
          object: 'ele',
          possessive: 'dele',
          article: 'o'
        };
      case 'female':
        return {
          subject: 'ela',
          object: 'ela', 
          possessive: 'dela',
          article: 'a'
        };
      default:
        return {
          subject: 'essa pessoa',
          object: 'essa pessoa',
          possessive: 'dessa pessoa',
          article: 'a'
        };
    }
  }
};