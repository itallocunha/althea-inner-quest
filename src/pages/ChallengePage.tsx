import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Sparkles, Lightbulb } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { ALL_CHALLENGES } from '@/data/gameData';
import { ATTRIBUTE_LABELS, AttributeKey } from '@/types/game';

export default function ChallengePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { completeChallenge, isChallengeCompleted } = useGame();
  const [response, setResponse] = useState('');
  const [showReward, setShowReward] = useState(false);

  const challenge = ALL_CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) return null;

  const completed = isChallengeCompleted(challenge.id);

  const handleComplete = () => {
    if (!response.trim()) return;
    completeChallenge(challenge.id, response);
    setShowReward(true);
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <button onClick={() => navigate(`/orb/${challenge.orbId}`)} className="flex items-center gap-1 text-muted-foreground font-body text-sm mb-4">
        <ChevronLeft size={16} /> Voltar
      </button>

      <AnimatePresence mode="wait">
        {!showReward ? (
          <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-display text-accent mb-2">{challenge.title}</h1>
            <div className="bg-card rounded-xl border border-border p-4 mb-4">
              <p className="text-sm font-body text-foreground/90 leading-relaxed">{challenge.narrative}</p>
            </div>
            <div className="bg-primary/10 rounded-xl border border-primary/30 p-4 mb-4">
              <h3 className="text-xs font-display text-accent mb-1 uppercase tracking-wider">Objetivo</h3>
              <p className="text-sm font-body">{challenge.objective}</p>
            </div>

            {challenge.tip && (
              <div className="bg-accent/10 rounded-xl border border-accent/30 p-4 mb-6 flex gap-3 items-start">
                <Lightbulb size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-xs font-display text-accent mb-1 uppercase tracking-wider">Dica</h3>
                  <p className="text-sm font-body text-foreground/80">{challenge.tip}</p>
                </div>
              </div>
            )}

            {!completed && (
              <>
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  rows={6}
                  placeholder="Escreva sua resposta, reflexão ou história..."
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none mb-4"
                />
                <motion.button
                  onClick={handleComplete}
                  disabled={!response.trim()}
                  className="w-full py-3.5 rounded-full gradient-accent text-accent-foreground font-display font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  whileTap={{ scale: 0.97 }}
                >
                  <Send size={16} /> Concluir Desafio
                </motion.button>
              </>
            )}

            {completed && (
              <div className="text-center py-8">
                <span className="text-4xl">✅</span>
                <p className="font-display text-accent mt-2">Desafio concluído!</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reward"
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Sparkles size={48} className="text-accent" />
            </motion.div>

            <h2 className="text-2xl font-display text-accent mb-2">Desafio Concluído!</h2>

            <motion.div
              className="bg-card rounded-xl border border-accent/30 p-4 mb-4 inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-accent font-display text-lg">+{challenge.xpReward} XP</p>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-muted-foreground font-body">🏅 Badge: {challenge.medalName}</p>
              <div className="text-xs text-muted-foreground font-body">
                {Object.entries(challenge.attributeBoosts).map(([k, v]) => (
                  <span key={k} className="mr-2">+{v} {ATTRIBUTE_LABELS[k as AttributeKey]}</span>
                ))}
              </div>
              {challenge.cardReward && (
                <p className="text-sm text-accent font-body">
                  {challenge.cardReward.icon} Carta: {challenge.cardReward.name}
                </p>
              )}
            </motion.div>

            <motion.button
              onClick={() => navigate(`/orb/${challenge.orbId}`)}
              className="mt-8 px-8 py-3 rounded-full gradient-accent text-accent-foreground font-display font-semibold"
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Continuar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
