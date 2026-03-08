import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ChevronRight } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { XPBar } from '@/components/XPBar';
import { BottomNav } from '@/components/BottomNav';

const ORB_STYLES: Record<string, { gradient: string; glow: string; ring: string; bgPattern: string }> = {
  blue: {
    gradient: 'from-[hsl(210_80%_55%)] to-[hsl(210_80%_35%)]',
    glow: 'shadow-[0_0_30px_hsl(210_80%_55%/0.4)]',
    ring: 'ring-[hsl(210_80%_55%/0.5)]',
    bgPattern: 'bg-[radial-gradient(circle_at_30%_20%,hsl(210_80%_55%/0.15),transparent_60%)]',
  },
  green: {
    gradient: 'from-[hsl(140_60%_45%)] to-[hsl(140_60%_30%)]',
    glow: 'shadow-[0_0_30px_hsl(140_60%_45%/0.4)]',
    ring: 'ring-[hsl(140_60%_45%/0.5)]',
    bgPattern: 'bg-[radial-gradient(circle_at_70%_80%,hsl(140_60%_45%/0.15),transparent_60%)]',
  },
  purple: {
    gradient: 'from-[hsl(270_60%_50%)] to-[hsl(270_60%_35%)]',
    glow: 'shadow-[0_0_30px_hsl(270_60%_50%/0.4)]',
    ring: 'ring-[hsl(270_60%_50%/0.5)]',
    bgPattern: 'bg-[radial-gradient(circle_at_50%_50%,hsl(270_60%_50%/0.15),transparent_60%)]',
  },
  red: {
    gradient: 'from-[hsl(0_70%_55%)] to-[hsl(0_70%_35%)]',
    glow: 'shadow-[0_0_30px_hsl(0_70%_55%/0.4)]',
    ring: 'ring-[hsl(0_70%_55%/0.5)]',
    bgPattern: 'bg-[radial-gradient(circle_at_80%_30%,hsl(0_70%_55%/0.15),transparent_60%)]',
  },
  yellow: {
    gradient: 'from-[hsl(45_100%_65%)] to-[hsl(45_100%_45%)]',
    glow: 'shadow-[0_0_30px_hsl(45_100%_65%/0.4)]',
    ring: 'ring-[hsl(45_100%_65%/0.5)]',
    bgPattern: 'bg-[radial-gradient(circle_at_20%_70%,hsl(45_100%_65%/0.15),transparent_60%)]',
  },
};

const ORB_EMOJIS: Record<string, string> = {
  blue: '🔵', green: '🟢', purple: '🟣', red: '🔴', yellow: '🟡',
};

export default function OrbsMap() {
  const navigate = useNavigate();
  const { state, getOrbProgress, isOrbUnlocked } = useGame();

  if (!state.character) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-accent" />
          <h1 className="text-xl font-display text-accent">Mapa das Orbes</h1>
        </div>
        <p className="text-xs font-body text-muted-foreground mb-3">Explore cada fragmento da sua jornada interior</p>
        <XPBar />
      </div>

      {/* Orb Cards */}
      <div className="relative flex flex-col items-center gap-5">
        {/* Connecting path line */}
        <div className="absolute top-8 bottom-8 left-1/2 -translate-x-px w-[2px] bg-gradient-to-b from-border via-accent/20 to-border -z-10" />

        {ORBS.map((orb, i) => {
          const unlocked = isOrbUnlocked(i);
          const progress = getOrbProgress(i);
          const style = ORB_STYLES[orb.id];
          const challenges = getChallengesForOrb(orb.id);
          const completed = challenges.filter(ch => state.challengeProgress[ch.id]?.completed).length;
          const isComplete = progress === 100;

          return (
            <motion.button
              key={orb.id}
              onClick={() => unlocked && navigate(`/orb/${orb.id}`)}
              disabled={!unlocked}
              className={`relative w-full rounded-2xl overflow-hidden transition-all ${
                unlocked ? '' : 'opacity-40 grayscale'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: unlocked ? 1 : 0.4, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={unlocked ? { scale: 1.02 } : {}}
              whileTap={unlocked ? { scale: 0.98 } : {}}
            >
              {/* Card background */}
              <div className={`absolute inset-0 bg-card ${style.bgPattern}`} />

              {/* Top accent bar */}
              <div className={`h-1 bg-gradient-to-r ${style.gradient}`} />

              <div className="relative p-4">
                <div className="flex items-start gap-4">
                  {/* Orb sphere */}
                  <div className="relative shrink-0">
                    <motion.div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center ${
                        unlocked && !isComplete ? style.glow : ''
                      } ${isComplete ? 'ring-2 ring-accent' : ''}`}
                      animate={unlocked && !isComplete ? {
                        boxShadow: [
                          `0 0 15px hsl(var(--orb-${orb.id}) / 0.3)`,
                          `0 0 30px hsl(var(--orb-${orb.id}) / 0.5)`,
                          `0 0 15px hsl(var(--orb-${orb.id}) / 0.3)`,
                        ],
                      } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      {unlocked ? (
                        <span className="text-2xl">{isComplete ? '✅' : ORB_EMOJIS[orb.id]}</span>
                      ) : (
                        <Lock size={18} className="text-muted-foreground" />
                      )}
                    </motion.div>
                    {/* Fragment number */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center border border-border">
                      <span className="text-[9px] font-display text-foreground">{i + 1}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-display text-sm font-semibold text-foreground leading-tight">{orb.name}</h3>
                    <p className="text-[11px] font-body text-accent mt-0.5">"{orb.theme}"</p>
                    <p className="text-[10px] font-body text-muted-foreground mt-1 line-clamp-1">{orb.focus}</p>

                    {unlocked && (
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[10px] font-body mb-1">
                          <span className="text-muted-foreground">{completed}/{challenges.length} desafios</span>
                          <span className="text-accent font-semibold">{progress}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${style.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                        <p className="text-[9px] font-body text-muted-foreground mt-1.5">
                          Desenvolve: {orb.develops}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  {unlocked && (
                    <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1" />
                  )}
                </div>
              </div>

              {/* Bottom border */}
              <div className="h-px bg-border" />
            </motion.button>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
