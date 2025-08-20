export type Relationship = 'Mom' | 'Dad' | 'Grandma' | 'Grandpa' | 'Partner' | 'Friend' | 'Other';

export type Warmth = 'Gentle' | 'Balanced' | 'Direct';
export type Formality = 'Casual' | 'Neutral' | 'Polite';
export type Energy = 'Calm' | 'Balanced' | 'Lively';
export type Pace = 'Slow' | 'Normal' | 'Fast';

export type Topic =
  | 'Birthday message'
  | 'Words of encouragement'
  | 'Sunday lunch memory'
  | 'Bedtime story'
  | 'Gentle reminder'
  | 'A funny story';

export type OutputType = 'text' | 'voice';
export type Timbre = 'Feminine' | 'Masculine' | 'Neutral';
export type Age = 'Young' | 'Adult' | 'Senior';

export interface DemoStyle {
  warmth: Warmth;
  formality: Formality;
  energy: Energy;
  pace: Pace;
}

export interface DemoOutputVoice {
  timbre: Timbre;
  age: Age;
}

export interface DemoOutput {
  type: OutputType;
  voice?: DemoOutputVoice;
}

export interface DemoPreview {
  primary: string;
  followUp: string;
  audioUrl?: string;
}

export interface DemoState {
  relationship?: Relationship;
  name?: string;
  style: DemoStyle;
  topic?: Topic;
  output: DemoOutput;
  preview?: DemoPreview;
}
