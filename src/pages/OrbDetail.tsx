import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, CheckCircle } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getChallengesForOrb, ORBS } from '@/data/gameData';
import { OrbId } from '@/types/game';
import { BottomNav } from '@/components/BottomNav';

export default function OrbDetail() {
  const { orbId } = useParams<{ orbId: string }>();
  const navigate = useNavigate();
  const { isChallengeUnlocked, isChallengeCompleted, getOrbProgress } = useGame();

  const orb = ORBS.find(o => o.id === orbId);
  if (!orb) return null;

  const challenges = getChallengesForOrb(orbId as OrbId);
  const progress = getOrbProgress(ORBS.indexOf(orb));

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <button onClick={() => navigate('/orbs')} className="flex items-center gap-1 text-muted-foreground font-body text-sm mb-4">
        <ChevronLeft size={16} /> Voltar
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-display text-accent">{orb.name}</h1>
        <p className="text-sm text-muted-foreground font-body">{orb.theme} — {orb.focus}</p>
        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full gradient-accent rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-muted-foreground font-body">{progress}% completo</span>
      </div>

      <div className="space-y-3">
        {challenges.map((ch, i) => {
          const unlocked = isChallengeUnlocked(ch.id);
          const completed = isChallengeCompleted(ch.id);

          return (
            <motion.button
              key={ch.id}
              onClick={() => unlocked && !completed && navigate(`/challenge/${ch.id}`)}
              disabled={!unlocked || completed}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                completed
                  ? 'border-accent/30 bg-accent/5'
                  : unlocked
                    ? 'border-border bg-card hover:border-primary'
                    : 'border-border bg-card/50 opacity-40'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold ${
                completed ? 'bg-accent text-accent-foreground' : unlocked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {completed ? <CheckCircle size={16} /> : unlocked ? i + 1 : <Lock size={12} />}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-sm">{ch.title}</h3>
                <p className="text-xs text-muted-foreground font-body">{ch.xpReward} XP • {ch.medalName}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
