import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { JOURNEY_GAMES, JourneyGame } from '@/data/feedData';
import { BottomNav } from '@/components/BottomNav';
import { Lock, ChevronRight } from 'lucide-react';

function GameCard({ game, progress }: { game: JourneyGame; progress?: number }) {
  const navigate = useNavigate();
  const isActive = game.status === 'active';

  return (
    <motion.button
      onClick={() => isActive && navigate('/orbs')}
      disabled={!isActive}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        isActive
          ? 'bg-card border-primary/40 hover:border-accent/60'
          : 'bg-card/50 border-border/50 opacity-60'
      }`}
      whileHover={isActive ? { scale: 1.01 } : {}}
      whileTap={isActive ? { scale: 0.99 } : {}}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
            isActive ? 'gradient-primary glow-primary' : 'bg-secondary'
          }`}
        >
          {game.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-display text-sm text-foreground truncate">{game.name}</h3>
            {!isActive && <Lock size={12} className="text-muted-foreground shrink-0" />}
          </div>
          <p className="text-xs font-body text-muted-foreground line-clamp-2">{game.description}</p>
          {isActive && typeof progress === 'number' && (
            <div className="mt-2">
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] font-body text-muted-foreground">Progresso</span>
                <span className="text-[10px] font-body text-accent">{progress}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          )}
        </div>
        {isActive && <ChevronRight size={16} className="text-muted-foreground shrink-0" />}
      </div>
      {!isActive && (
        <div className="mt-2 inline-block px-2 py-0.5 rounded-full bg-secondary">
          <span className="text-[10px] font-body text-muted-foreground">Em Breve</span>
        </div>
      )}
    </motion.button>
  );
}

export default function Journeys() {
  const { getOrbProgress } = useGame();
  
  // Calculate overall self-knowledge game progress
  const totalProgress = Math.round(
    [0, 1, 2, 3, 4].reduce((sum, i) => sum + getOrbProgress(i), 0) / 5
  );

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-display text-accent mb-1">Jornadas</h1>
        <p className="text-xs font-body text-muted-foreground">Escolha sua próxima aventura evolutiva</p>
      </div>

      <div className="space-y-3">
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
            />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
