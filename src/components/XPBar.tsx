import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';

export function XPBar() {
  const { state } = useGame();
  if (!state.character) return null;

  const currentXP = xpForCurrentLevel(state.character.xp);
  const percent = (currentXP / XP_PER_LEVEL) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-body text-muted-foreground">Nível {state.character.level}</span>
        <span className="text-xs font-body text-accent">{currentXP}/{XP_PER_LEVEL} XP</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
