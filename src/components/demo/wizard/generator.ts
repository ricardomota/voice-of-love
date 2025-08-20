import { DemoState, Topic, Warmth, Formality, Energy, Pace } from './types';

function applyStyleTone(text: string, style: DemoState['style']) {
  let result = text;
  // Warmth adjustments
  if (style.warmth === 'Gentle') result = `Dear ${result}`;
  if (style.warmth === 'Direct') result = result.replace(/I'm here with you\./, "I'm right here with you.");

  // Formality adjustments
  if (style.formality === 'Polite') result = result.replace(/Let's/, 'Let us');
  if (style.formality === 'Casual') result = result.replace(/I am|I'm/g, "I'm");

  // Energy adjustments
  if (style.energy === 'Lively') result = result + ' ✨';
  if (style.energy === 'Calm') result = result.replace(/!/g, '.');

  // Pace hint (used as subtle punctuation tweaks)
  if (style.pace === 'Slow') result = result.replace(/\./g, '…');
  if (style.pace === 'Fast') result = result.replace('together', 'together, okay?');

  return result;
}

function topicSeed(topic?: Topic) {
  switch (topic) {
    case 'Birthday message':
      return 'It’s your special day, and I picked this memory just for you — a candlelit cake and that big smile.';
    case 'Words of encouragement':
      return 'One small step at a time, hand in hand, and I’ll cheer for you with each little victory.';
    case 'Sunday lunch memory':
      return 'I can almost smell the fresh bread and hear our laughter around the table on those sunny Sundays.';
    case 'Bedtime story':
      return 'Close your eyes, breathe slow, and I’ll guide you through a tiny tale where everything feels safe.';
    case 'Gentle reminder':
      return 'Just a tiny reminder, softly said, so the day feels lighter and easier to follow.';
    case 'A funny story':
      return 'Remember when we laughed so hard we cried — the little mix‑up that turned into our favorite joke?';
    default:
      return 'I’m here with a small memory to hold onto, something warm we can revisit together.';
    }
}

export function generatePreviewText(state: DemoState) {
  const helloName = state.name && state.name.trim().length > 0 ? state.name.trim() : 'dear';
  const base = `${helloName}, I’m here with you. Let’s remember this together.`;

  const primarySeed = `${applyStyleTone(base, state.style)} ${topicSeed(state.topic)}`;
  // Keep within 120–180 chars by slicing if needed
  const primary = primarySeed.length > 180 ? primarySeed.slice(0, 177).trimEnd() + '…' : primarySeed;

  const followSeed = 'If you want, we can talk about another moment or simply sit quietly for a while.';
  const followStyled = applyStyleTone(followSeed, state.style);
  const followUp = followStyled.length > 100 ? followStyled.slice(0, 97).trimEnd() + '…' : followStyled;

  return { primary, followUp };
}
