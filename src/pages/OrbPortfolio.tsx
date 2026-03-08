import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, ImageIcon, FileText } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getChallengesForOrb, ORBS } from '@/data/gameData';
import { OrbId } from '@/types/game';
import { useState } from 'react';

const ORB_ACCENT: Record<string, string> = {
  blue: 'text-blue-400', green: 'text-emerald-400', purple: 'text-purple-400',
  red: 'text-red-400', yellow: 'text-amber-400',
};

export default function OrbPortfolio() {
  const { orbId } = useParams<{ orbId: string }>();
  const navigate = useNavigate();
  const { state } = useGame();
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const orb = ORBS.find(o => o.id === orbId);
  if (!orb) return null;

  const challenges = getChallengesForOrb(orbId as OrbId);
  const completedChallenges = challenges.filter(c => state.challengeProgress[c.id]?.completed);
  const accent = ORB_ACCENT[orb.id] || 'text-accent';

  const selected = completedChallenges.find(c => c.id === selectedChallenge);
  const selectedProgress = selected ? state.challengeProgress[selected.id] : null;

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <button onClick={() => navigate('/profile')} className="flex items-center gap-1 text-muted-foreground font-body text-sm mb-4">
        <ChevronLeft size={16} /> Voltar ao Perfil
      </button>

      <div className="text-center mb-6">
        <span className="text-4xl">🔮</span>
        <h1 className={`text-xl font-display ${accent} mt-2`}>{orb.name}</h1>
        <p className="text-xs font-body text-muted-foreground">{completedChallenges.length} desafios concluídos</p>
      </div>

      {completedChallenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-body text-sm">Nenhum desafio concluído ainda nesta orbe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {completedChallenges.map((ch, i) => {
            const prog = state.challengeProgress[ch.id];
            return (
              <motion.button
                key={ch.id}
                onClick={() => setSelectedChallenge(ch.id)}
                className="bg-card rounded-2xl border border-border overflow-hidden text-left hover:border-accent/30 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.96 }}
              >
                {prog?.imageUrl ? (
                  <img src={prog.imageUrl} alt={ch.title} className="w-full h-28 object-cover" />
                ) : (
                  <div className="w-full h-28 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                    <FileText size={24} className="text-muted-foreground/40" />
                  </div>
                )}
                <div className="p-2.5">
                  <h3 className="font-display text-[11px] text-foreground leading-tight line-clamp-1">{ch.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {prog?.imageUrl && <ImageIcon size={10} className={accent} />}
                    {prog?.response && <FileText size={10} className={accent} />}
                    <span className="text-[9px] font-body text-muted-foreground ml-auto">
                      {prog?.completedAt ? new Date(prog.completedAt).toLocaleDateString('pt-BR') : ''}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && selectedProgress && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              className="bg-card w-full max-w-md rounded-t-3xl max-h-[85vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-card z-10 p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-sm text-accent">{selected.title}</h2>
                <button onClick={() => setSelectedChallenge(null)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {selectedProgress.imageUrl && (
                  <img src={selectedProgress.imageUrl} alt={selected.title} className="w-full rounded-xl" />
                )}

                {selectedProgress.response && (
                  <div>
                    <h3 className="text-[10px] font-display text-accent uppercase tracking-wider mb-2">Resposta</h3>
                    <p className="text-sm font-body text-foreground/80 whitespace-pre-line leading-relaxed">
                      {selectedProgress.response}
                    </p>
                  </div>
                )}

                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-[10px] font-body text-muted-foreground">
                    🏅 {selected.medalName} • +{selected.xpReward} XP
                  </p>
                  {selectedProgress.completedAt && (
                    <p className="text-[10px] font-body text-muted-foreground mt-0.5">
                      Concluído em {new Date(selectedProgress.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
