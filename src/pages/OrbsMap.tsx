import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { ORBS } from '@/data/gameData';
import { XPBar } from '@/components/XPBar';
import { BottomNav } from '@/components/BottomNav';

const ORB_COLORS: Record<string, string> = {
  blue: 'from-orb-blue/40 to-orb-blue/10 border-orb-blue shadow-[0_0_20px_hsl(210_80%_55%/0.3)]',
  green: 'from-orb-green/40 to-orb-green/10 border-orb-green shadow-[0_0_20px_hsl(140_60%_45%/0.3)]',
  purple: 'from-orb-purple/40 to-orb-purple/10 border-orb-purple shadow-[0_0_20px_hsl(270_60%_50%/0.3)]',
  red: 'from-orb-red/40 to-orb-red/10 border-orb-red shadow-[0_0_20px_hsl(0_70%_55%/0.3)]',
  yellow: 'from-orb-yellow/40 to-orb-yellow/10 border-orb-yellow shadow-[0_0_20px_hsl(45_100%_65%/0.3)]',
};

const ORB_EMOJIS = ['🔵', '🟢', '🟣', '🔴', '🟡'];

export default function OrbsMap() {
  const navigate = useNavigate();
  const { state, getOrbProgress, isOrbUnlocked } = useGame();

  if (!state.character) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-display text-accent mb-1">Mapa das Orbes</h1>
        <XPBar />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Connecting line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-0.5 bg-border -z-10" />

        {ORBS.map((orb, i) => {
          const unlocked = isOrbUnlocked(i);
          const progress = getOrbProgress(i);

          return (
            <motion.button
              key={orb.id}
              onClick={() => unlocked && navigate(`/orb/${orb.id}`)}
              disabled={!unlocked}
              className={`relative w-full max-w-xs rounded-2xl border-2 p-5 bg-gradient-to-br transition-all ${
                unlocked ? ORB_COLORS[orb.id] : 'from-secondary/50 to-secondary/20 border-border opacity-50'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={unlocked ? { scale: 1.02 } : {}}
              whileTap={unlocked ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{unlocked ? ORB_EMOJIS[i] : ''}</span>
                <div className="text-left flex-1">
                  <h3 className="font-display text-sm font-semibold">{orb.name}</h3>
                  <p className="text-xs text-muted-foreground font-body">{orb.theme}</p>
                </div>
                {!unlocked && <Lock size={16} className="text-muted-foreground" />}
              </div>

              {unlocked && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground font-body mb-1">
                    <span>{orb.develops}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-background/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-foreground/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
