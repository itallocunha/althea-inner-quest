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

export type AttributeKey =
  | 'intelligence' | 'physicalStrength' | 'emotionalStrength'
  | 'resilience' | 'selfKnowledge' | 'communication'
  | 'teamwork' | 'focus' | 'creativity'
  | 'determination' | 'leadership' | 'selfManagement'
  | 'empathy' | 'problemSolving' | 'adaptability';

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  intelligence: 'Inteligência',
  physicalStrength: 'Força Física',
  emotionalStrength: 'Força Emocional',
  resilience: 'Resiliência',
  selfKnowledge: 'Autoconhecimento',
  communication: 'Comunicação',
  teamwork: 'Trabalho em Equipe',
  focus: 'Foco',
  creativity: 'Criatividade',
  determination: 'Determinação',
  leadership: 'Liderança',
  selfManagement: 'Autogestão',
  empathy: 'Empatia',
  problemSolving: 'Resolução de Problemas',
  adaptability: 'Adaptabilidade',
};

export type Attributes = Record<AttributeKey, number>;

export const DEFAULT_ATTRIBUTES: Attributes = {
  intelligence: 0, physicalStrength: 0, emotionalStrength: 0,
  resilience: 0, selfKnowledge: 0, communication: 0,
  teamwork: 0, focus: 0, creativity: 0,
  determination: 0, leadership: 0, selfManagement: 0,
  empathy: 0, problemSolving: 0, adaptability: 0,
};

export type OrbId = 'blue' | 'green' | 'purple' | 'red' | 'yellow';

export interface Challenge {
  id: string;
  orbId: OrbId;
  index: number;
  title: string;
  narrative: string;
  objective: string;
  attributeBoosts: Partial<Attributes>;
  xpReward: number;
  medalName: string;
  cardReward?: ItemCard | SkillCard;
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

export interface GameState {
  character: CharacterData | null;
  challengeProgress: Record<string, ChallengeProgress>;
  unlockedMedals: string[];
  itemCards: ItemCard[];
  skillCards: SkillCard[];
  currentOrbIndex: number;
}

export const XP_PER_LEVEL = 100;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpForCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
