export type Race = 'human' | 'elf' | 'dwarf' | 'draconian' | 'fairy' | 'orc';
export type CharacterClass = 'paladin' | 'mage' | 'warrior' | 'archer' | 'rogue';

export const RACE_LABELS: Record<Race, string> = {
  human: 'Humanos',
  elf: 'Elfos da Floresta',
  dwarf: 'Anões das Montanhas',
  draconian: 'Draconianos',
  fairy: 'Fadas do Crepúsculo',
  orc: 'Orcs Sombrios',
};

export const CLASS_LABELS: Record<CharacterClass, string> = {
  paladin: 'Paladino Luminar',
  mage: 'Mago Elemental',
  warrior: 'Guerreiro da Lâmina',
  archer: 'Arqueiro Sombrio',
  rogue: 'Ladino das Sombras',
};

export const RACE_ICONS: Record<Race, string> = {
  human: '🧑',
  elf: '🧝',
  dwarf: '⛏️',
  draconian: '🐉',
  fairy: '🧚',
  orc: '👹',
};

export const CLASS_ICONS: Record<CharacterClass, string> = {
  paladin: '🛡️',
  mage: '🔮',
  warrior: '⚔️',
  archer: '🏹',
  rogue: '🗡️',
};

// Core attributes (evolved through self-knowledge journey)
export type CoreAttributeKey =
  | 'intelligence' | 'physicalStrength' | 'emotionalStrength'
  | 'resilience' | 'selfKnowledge' | 'communication'
  | 'teamwork' | 'focus' | 'creativity'
  | 'determination' | 'leadership' | 'selfManagement'
  | 'empathy' | 'problemSolving' | 'adaptability';

// RPG / Advanced attributes (evolved through future journeys)
export type AdvancedAttributeKey =
  | 'charisma' | 'wisdom' | 'agility'
  | 'perception' | 'endurance' | 'luck'
  | 'discipline' | 'strategy' | 'persuasion'
  | 'intuition' | 'courage' | 'patience';

export type AttributeKey = CoreAttributeKey | AdvancedAttributeKey;

export const ATTRIBUTE_MAX = 100;

export const CORE_ATTRIBUTE_META: Record<CoreAttributeKey, { label: string; icon: string; color: string }> = {
  intelligence:      { label: 'Inteligência',         icon: '🧠', color: '210 80% 55%' },
  physicalStrength:  { label: 'Força Física',         icon: '💪', color: '0 70% 55%' },
  emotionalStrength: { label: 'Força Emocional',      icon: '💜', color: '270 60% 55%' },
  resilience:        { label: 'Resiliência',          icon: '🛡️', color: '160 60% 45%' },
  selfKnowledge:     { label: 'Autoconhecimento',     icon: '🔮', color: '260 70% 60%' },
  communication:     { label: 'Comunicação',          icon: '💬', color: '190 70% 50%' },
  teamwork:          { label: 'Trabalho em Equipe',   icon: '🤝', color: '140 50% 50%' },
  focus:             { label: 'Foco',                 icon: '🎯', color: '30 80% 55%' },
  creativity:        { label: 'Criatividade',         icon: '🎨', color: '320 60% 55%' },
  determination:     { label: 'Determinação',         icon: '🔥', color: '10 80% 55%' },
  leadership:        { label: 'Liderança',            icon: '👑', color: '45 90% 55%' },
  selfManagement:    { label: 'Autogestão',           icon: '⚙️', color: '200 50% 50%' },
  empathy:           { label: 'Empatia',              icon: '❤️', color: '340 70% 55%' },
  problemSolving:    { label: 'Resolução de Problemas', icon: '🧩', color: '170 60% 45%' },
  adaptability:      { label: 'Adaptabilidade',       icon: '🌊', color: '220 60% 55%' },
};

export const ADVANCED_ATTRIBUTE_META: Record<AdvancedAttributeKey, { label: string; icon: string; color: string; journey: string }> = {
  charisma:    { label: 'Carisma',       icon: '✨', color: '45 100% 65%',  journey: 'Oratória' },
  wisdom:      { label: 'Sabedoria',     icon: '📖', color: '270 50% 60%',  journey: 'Filosofia' },
  agility:     { label: 'Agilidade',     icon: '⚡', color: '50 80% 55%',   journey: 'Performance' },
  perception:  { label: 'Percepção',     icon: '👁️', color: '180 60% 50%',  journey: 'Investigação' },
  endurance:   { label: 'Resistência',   icon: '🏔️', color: '150 40% 45%',  journey: 'Sobrevivência' },
  luck:        { label: 'Sorte',         icon: '🍀', color: '120 60% 50%',  journey: 'Aventura' },
  discipline:  { label: 'Disciplina',    icon: '⏳', color: '210 40% 50%',  journey: 'Liderança' },
  strategy:    { label: 'Estratégia',    icon: '♟️', color: '230 50% 50%',  journey: 'Educação Financeira' },
  persuasion:  { label: 'Persuasão',     icon: '🗣️', color: '350 60% 55%',  journey: 'Oratória' },
  intuition:   { label: 'Intuição',      icon: '🌙', color: '280 60% 55%',  journey: 'Espiritualidade' },
  courage:     { label: 'Coragem',       icon: '⚔️', color: '15 75% 55%',   journey: 'Aventura' },
  patience:    { label: 'Paciência',     icon: '🧘', color: '160 45% 50%',  journey: 'Mindfulness' },
};

// Combined labels for backward compat
export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  ...Object.fromEntries(Object.entries(CORE_ATTRIBUTE_META).map(([k, v]) => [k, v.label])),
  ...Object.fromEntries(Object.entries(ADVANCED_ATTRIBUTE_META).map(([k, v]) => [k, v.label])),
} as Record<AttributeKey, string>;

export type Attributes = Record<AttributeKey, number>;

export const DEFAULT_ATTRIBUTES: Attributes = {
  intelligence: 0, physicalStrength: 0, emotionalStrength: 0,
  resilience: 0, selfKnowledge: 0, communication: 0,
  teamwork: 0, focus: 0, creativity: 0,
  determination: 0, leadership: 0, selfManagement: 0,
  empathy: 0, problemSolving: 0, adaptability: 0,
  // Advanced
  charisma: 0, wisdom: 0, agility: 0,
  perception: 0, endurance: 0, luck: 0,
  discipline: 0, strategy: 0, persuasion: 0,
  intuition: 0, courage: 0, patience: 0,
};

export type OrbId = 'blue' | 'green' | 'purple' | 'red' | 'yellow';

export interface Challenge {
  id: string;
  orbId: OrbId;
  index: number;
  title: string;
  narrative: string;
  objective: string;
  tip?: string;
  attributeBoosts: Partial<Attributes>;
  xpReward: number;
  medalName: string;
  cardReward?: ItemCard | SkillCard;
}

export interface OrbStory {
  orbId: OrbId;
  fragmentTitle: string;
  story: string;
  learningObjectives: string[];
  reflectionPoint: string;
  completionSkill: SkillCard;
  completionAttributeBoosts: Partial<Attributes>;
  trajectoryStory: string;
  finalReflection: string;
}

export interface ItemCard {
  type: 'item';
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface SkillCard {
  type: 'skill';
  id: string;
  name: string;
  description: string;
  passive: boolean;
  icon: string;
}

export interface OrbData {
  id: OrbId;
  name: string;
  theme: string;
  focus: string;
  develops: string;
  colorClass: string;
}

export interface CharacterData {
  name: string;
  age: number;
  race: Race;
  characterClass: CharacterClass;
  attributes: Attributes;
  level: number;
  xp: number;
  freePoints: number;
  backstory?: string;
}

export interface ChallengeProgress {
  challengeId: string;
  completed: boolean;
  response?: string;
  imageUrl?: string;
  completedAt?: string;
}

export interface CharacterStory {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface GameState {
  character: CharacterData | null;
  challengeProgress: Record<string, ChallengeProgress>;
  unlockedMedals: string[];
  itemCards: ItemCard[];
  skillCards: SkillCard[];
  currentOrbIndex: number;
  stories: CharacterStory[];
}

export const XP_PER_LEVEL = 100;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpForCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
