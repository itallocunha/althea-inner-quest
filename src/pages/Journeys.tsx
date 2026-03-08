import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { JOURNEY_GAMES, JourneyGame } from '@/data/feedData';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { BottomNav } from '@/components/BottomNav';
import { Lock, ChevronRight, Star, Trophy, Zap } from 'lucide-react';

function GameCard({ game, progress, orbStats }: { 
  game: JourneyGame; 
  progress?: number;
  orbStats?: { completed: number; total: number; currentOrb: string }; 
}) {
  const navigate = useNavigate();
  const isActive = game.status === 'active';

  return (
    <motion.button
      onClick={() => isActive && navigate('/orbs')}
      disabled={!isActive}
      className={`w-full text-left rounded-2xl border overflow-hidden transition-all ${
        isActive
          ? 'bg-card border-primary/40 hover:border-accent/60'
          : 'bg-card/50 border-border/50 opacity-60'
      }`}
      whileHover={isActive ? { scale: 1.01 } : {}}
      whileTap={isActive ? { scale: 0.99 } : {}}
    >
      {/* Header gradient */}
      <div
        className="h-20 relative flex items-center px-5"
        style={{
          background: isActive
            ? `linear-gradient(135deg, hsl(${game.color}), hsl(${game.color} / 0.6))`
            : 'linear-gradient(135deg, hsl(270 20% 20%), hsl(270 15% 15%))',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
        <div className="relative z-10 flex items-center gap-4 w-full">
          <span className="text-4xl">{game.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm text-white drop-shadow-md">{game.name}</h3>
            {!isActive && (
              <div className="flex items-center gap-1 mt-0.5">
                <Lock size={10} className="text-white/60" />
                <span className="text-[10px] font-body text-white/60">Em Breve</span>
              </div>
            )}
          </div>
          {isActive && <ChevronRight size={18} className="text-white/70 shrink-0" />}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs font-body text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
        
        {isActive && typeof progress === 'number' && (
          <>
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-body text-muted-foreground">Progresso Geral</span>
                <span className="text-[10px] font-body text-accent font-semibold">{progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Stats row */}
            {orbStats && (
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Trophy size={12} className="text-accent" />
                  <span className="text-[10px] font-body text-muted-foreground">
                    {orbStats.completed}/{orbStats.total} desafios
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-accent" />
                  <span className="text-[10px] font-body text-muted-foreground">
                    5 Orbes
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-accent" />
                  <span className="text-[10px] font-body text-muted-foreground">
                    {orbStats.currentOrb}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
}

export default function Journeys() {
  const { getOrbProgress, state } = useGame();
  
  const totalProgress = Math.round(
    [0, 1, 2, 3, 4].reduce((sum, i) => sum + getOrbProgress(i), 0) / 5
  );

  const totalCompleted = Object.values(state.challengeProgress).filter(p => p.completed).length;
  const totalChallenges = ORBS.reduce((sum, orb) => sum + getChallengesForOrb(orb.id).length, 0);
  const currentOrb = ORBS[Math.min(state.currentOrbIndex, ORBS.length - 1)];

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-display text-accent mb-1">Jornadas</h1>
        <p className="text-xs font-body text-muted-foreground">Escolha sua próxima aventura evolutiva</p>
      </div>

      <div className="space-y-4">
        {JOURNEY_GAMES.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GameCard
              game={game}
              progress={game.id === 'self-knowledge' ? totalProgress : undefined}
              orbStats={game.id === 'self-knowledge' ? {
                completed: totalCompleted,
                total: totalChallenges,
                currentOrb: currentOrb?.name || '',
              } : undefined}
            />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
