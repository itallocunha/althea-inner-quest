import { ALL_CHALLENGES, ORBS } from '@/data/gameData';
import type { ItemCard, SkillCard } from '@/types/game';
import type { RpgIconName } from '@/components/rpg/RpgIcon';
import type { Card3DData } from '@/components/rpg/Card3DViewer';

const ICONS: Record<string, RpgIconName> = {
  '🖼️': 'mirror', '🛡️': 'shield', '💎': 'gem', '📜': 'scroll', '🔮': 'orb',
  '🏺': 'gem', '🏅': 'medal', '🪞': 'mirror', '🧵': 'spark', '📊': 'scroll',
  '🗺️': 'map', '⛏️': 'sword', '🧭': 'compass', '🌱': 'tree', '🏆': 'trophy',
  '💡': 'spark', '✍️': 'quill', '💌': 'scroll', '👶': 'star', '📝': 'quill',
  '⚖️': 'shield', '🔭': 'eye', '🪜': 'map', '📋': 'scroll', '🌟': 'star',
  '🧰': 'chest', '🌿': 'tree', '👑': 'crown', '👁️': 'eye', '🕸️': 'hourglass',
  '🪽': 'wings', '🔥': 'flame', '⚡': 'spark', '🌊': 'moon',
};

export const COLLECTION_CATALOG = ALL_CHALLENGES.flatMap(challenge => challenge.cardReward ? [challenge.cardReward] : []);

export function getRewardPresentation(card: ItemCard | SkillCard) {
  const challenge = ALL_CHALLENGES.find(ch => ch.cardReward?.id === card.id);
  const orb = ORBS.find(orb => orb.id === challenge?.orbId);
  const color = orb ? `var(--orb-${orb.id})` : card.type === 'skill' ? '275 65% 68%' : '43 92% 64%';
  return { icon: ICONS[card.icon] || (card.type === 'skill' ? 'spark' : 'gem'), color, challenge, orb };
}

export function matchesCollectionSearch(card: ItemCard | SkillCard, query: string) {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  return normalize(`${card.name} ${card.description}`).includes(normalize(query.trim()));
}

export function getRewardProjection(card: ItemCard | SkillCard): Card3DData {
  const { icon, color, orb, challenge } = getRewardPresentation(card);
  return {
    name: card.name,
    description: card.description,
    badge: card.type === 'item' ? card.category : card.passive ? 'Habilidade passiva' : 'Habilidade ativa',
    iconName: icon,
    color,
    orbId: orb?.id,
    backTitle: challenge?.title || 'Uma conquista da sua jornada',
    backDescription: challenge
      ? `Recebido no desafio ${challenge.index + 1} da ${orb?.name}. Cada conquista guarda um pedaço da sua história.`
      : 'Este selo faz parte do seu acervo de conquistas em Althea.',
  };
}
