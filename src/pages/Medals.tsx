import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { ALL_CHALLENGES } from '@/data/gameData';
import { useNavigate } from 'react-router-dom';
import { Lock, Trophy } from 'lucide-react';

export default function Medals() {
  const navigate = useNavigate();
  const { state } = useGame();

  if (!state.character) { navigate('/'); return null; }

  const allMedals = ALL_CHALLENGES.map(c => c.medalName);
  const unlocked = new Set(state.unlockedMedals);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-display text-accent mb-1">Medalhas</h1>
      <p className="text-sm text-muted-foreground font-body mb-4">{unlocked.size}/{allMedals.length} desbloqueadas</p>

      <div className="grid grid-cols-3 gap-3">
        {allMedals.map((medal, i) => {
          const isUnlocked = unlocked.has(medal);
          return (
            <motion.div
              key={i}
              className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 text-center ${
                isUnlocked ? 'border-accent/30 bg-accent/5' : 'border-border bg-card/50'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              {isUnlocked ? (
                <>
                  <Trophy size={20} className="text-accent mb-1" />
                  <span className="text-[9px] font-body text-accent leading-tight">{medal}</span>
                </>
              ) : (
                <Lock size={14} className="text-muted-foreground" />
              )}
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
