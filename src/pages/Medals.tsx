import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { ALL_CHALLENGES } from '@/data/gameData';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

// Map medals to orb colors for visual theming
const ORB_MEDAL_COLORS: Record<string, { gradient: string; glow: string; border: string }> = {
  blue: {
    gradient: 'from-blue-400 via-blue-500 to-blue-700',
    glow: 'shadow-blue-500/40',
    border: 'border-blue-400/40',
  },
  green: {
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-700',
    glow: 'shadow-emerald-500/40',
    border: 'border-emerald-400/40',
  },
  purple: {
    gradient: 'from-purple-400 via-purple-500 to-purple-700',
    glow: 'shadow-purple-500/40',
    border: 'border-purple-400/40',
  },
  red: {
    gradient: 'from-red-400 via-rose-500 to-red-700',
    glow: 'shadow-red-500/40',
    border: 'border-red-400/40',
  },
  yellow: {
    gradient: 'from-yellow-300 via-amber-400 to-amber-600',
    glow: 'shadow-amber-500/40',
    border: 'border-amber-400/40',
  },
};

const MEDAL_ICONS = [
  '🏅', '⭐', '🎖️', '🏆', '💫', '✨', '🌟', '🔱', '👑', '💎',
];

export default function Medals() {
  const navigate = useNavigate();
  const { state } = useGame();

  if (!state.character) { navigate('/'); return null; }

  const allMedalData = ALL_CHALLENGES.map(c => ({
    name: c.medalName,
    orbId: c.orbId,
    challenge: c.title,
    xp: c.xpReward,
    index: c.index,
  }));
  const unlocked = new Set(state.unlockedMedals);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-display text-accent mb-1">Coleção de Medalhas</h1>
      <p className="text-xs text-muted-foreground font-body mb-6">
        {unlocked.size}/{allMedalData.length} desbloqueadas
      </p>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.size / allMedalData.length) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {allMedalData.map((medal, i) => {
          const isUnlocked = unlocked.has(medal.name);
          const colors = ORB_MEDAL_COLORS[medal.orbId] || ORB_MEDAL_COLORS.blue;
          const icon = MEDAL_ICONS[medal.index % MEDAL_ICONS.length];

          return (
            <motion.div
              key={i}
              className={`relative rounded-2xl overflow-hidden ${
                isUnlocked ? `border-2 ${colors.border} shadow-lg ${colors.glow}` : 'border border-border'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
              whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
            >
              {isUnlocked ? (
                <>
                  {/* Medal art */}
                  <div className={`h-24 bg-gradient-to-br ${colors.gradient} flex items-center justify-center relative`}>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.2),transparent_60%)]" />
                    <motion.span
                      className="text-4xl drop-shadow-lg relative z-10"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                    >
                      {icon}
                    </motion.span>
                  </div>
                  {/* Medal info */}
                  <div className="bg-card p-3">
                    <h3 className="font-display text-[11px] text-accent leading-tight">{medal.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-body mt-1">
                      Desafio: {medal.challenge}
                    </p>
                    <div className="mt-2 pt-1.5 border-t border-border flex items-center justify-between">
                      <span className="text-[8px] font-body text-accent">+{medal.xp} XP</span>
                      <span className="text-[8px] font-body text-muted-foreground uppercase tracking-wider">
                        {medal.orbId === 'blue' ? 'Azul' : medal.orbId === 'green' ? 'Verde' : medal.orbId === 'purple' ? 'Roxa' : medal.orbId === 'red' ? 'Vermelha' : 'Amarela'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full bg-card/50 flex flex-col items-center justify-center py-8 px-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                  <span className="text-[9px] font-body text-muted-foreground leading-tight">{medal.name}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
