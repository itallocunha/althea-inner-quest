import { useGame } from '@/context/GameContext';
import { xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';
import { XpMeter } from '@/components/rpg/Ornaments';

export function XPBar() {
  const { state } = useGame();
  if (!state.character) return null;

  const currentXP = xpForCurrentLevel(state.character.xp);

  return (
    <XpMeter
      percent={(currentXP / XP_PER_LEVEL) * 100}
      label={`Nível ${state.character.level}`}
      value={`${currentXP}/${XP_PER_LEVEL} XP`}
    />
  );
}
