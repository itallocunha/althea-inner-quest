import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Sparkles, Lightbulb, ImagePlus, X, Eye } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { ALL_CHALLENGES } from '@/data/gameData';
import { ATTRIBUTE_LABELS, AttributeKey } from '@/types/game';

export default function ChallengePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { completeChallenge, isChallengeCompleted, state } = useGame();
  const [response, setResponse] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const challenge = ALL_CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) return null;

  const completed = isChallengeCompleted(challenge.id);
  const progress = state.challengeProgress[challenge.id];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAttachedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleComplete = () => {
    if (!response.trim() && !attachedImage) return;
    completeChallenge(challenge.id, response, attachedImage || undefined);
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
            {/* Challenge Header */}
            <div className="relative rounded-2xl overflow-hidden mb-5">
              <div className="h-24 bg-gradient-to-br from-primary via-primary/70 to-accent/40 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
              </div>
              <div className="relative -mt-6 px-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-lg shrink-0">
                    <span className="text-xl font-display font-bold text-accent-foreground">
                      {challenge.index + 1}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h1 className="text-lg font-display text-accent leading-tight">{challenge.title}</h1>
                    <p className="text-[10px] font-body text-muted-foreground mt-0.5">
                      +{challenge.xpReward} XP • 🏅 {challenge.medalName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Card */}
            <div className="bg-card rounded-2xl border border-border p-4 mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-[10px] font-display text-accent uppercase tracking-wider mb-2">📖 Narrativa</h3>
              <p className="text-sm font-body text-foreground/90 leading-relaxed">{challenge.narrative}</p>
            </div>

            {/* Objective */}
            <div className="bg-primary/10 rounded-2xl border border-primary/30 p-4 mb-4">
              <h3 className="text-[10px] font-display text-accent mb-1.5 uppercase tracking-wider">🎯 Objetivo</h3>
              <p className="text-sm font-body text-foreground/90">{challenge.objective}</p>
            </div>

            {/* Tip */}
            {challenge.tip && (
              <div className="bg-accent/10 rounded-2xl border border-accent/30 p-4 mb-4 flex gap-3 items-start">
                <Lightbulb size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-[10px] font-display text-accent mb-1 uppercase tracking-wider">Dica</h3>
                  <p className="text-sm font-body text-foreground/80">{challenge.tip}</p>
                </div>
              </div>
            )}

            {/* Rewards Preview */}
            <div className="bg-card rounded-2xl border border-border p-4 mb-5">
              <h3 className="text-[10px] font-display text-accent mb-2 uppercase tracking-wider">🎁 Recompensas</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-accent/10 text-[10px] font-body text-accent border border-accent/20">
                  +{challenge.xpReward} XP
                </span>
                {Object.entries(challenge.attributeBoosts).map(([k, v]) => (
                  <span key={k} className="px-2.5 py-1 rounded-full bg-primary/10 text-[10px] font-body text-foreground border border-primary/20">
                    +{v} {ATTRIBUTE_LABELS[k as AttributeKey]}
                  </span>
                ))}
                {challenge.cardReward && (
                  <span className="px-2.5 py-1 rounded-full bg-accent/15 text-[10px] font-body text-accent border border-accent/20">
                    {challenge.cardReward.icon} {challenge.cardReward.name}
                  </span>
                )}
              </div>
            </div>

            {/* Completed Portfolio View */}
            {completed && progress && (
              <div className="space-y-3 mb-4">
                <div className="bg-accent/10 rounded-2xl border border-accent/30 p-4 text-center">
                  <span className="text-4xl">✅</span>
                  <p className="font-display text-accent mt-2 text-sm">Desafio concluído!</p>
                  {progress.completedAt && (
                    <p className="text-[10px] font-body text-muted-foreground mt-1">
                      Concluído em {new Date(progress.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Show submitted response */}
                {progress.response && (
                  <div className="bg-card rounded-2xl border border-border p-4">
                    <h3 className="text-[10px] font-display text-accent mb-2 uppercase tracking-wider">📝 Sua Resposta</h3>
                    <p className="text-sm font-body text-foreground/80 whitespace-pre-line">{progress.response}</p>
                  </div>
                )}

                {/* Show submitted image */}
                {progress.imageUrl && (
                  <div className="bg-card rounded-2xl border border-border p-3">
                    <h3 className="text-[10px] font-display text-accent mb-2 uppercase tracking-wider">🖼️ Sua Arte</h3>
                    <img
                      src={progress.imageUrl}
                      alt="Resposta do desafio"
                      className="w-full rounded-xl object-cover max-h-64"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Input Area */}
            {!completed && (
              <div className="space-y-3">
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  rows={5}
                  placeholder="Escreva sua resposta, reflexão ou história..."
                  className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none text-sm"
                />

                {/* Image attachment */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-accent/40 bg-accent/5 text-accent text-xs font-body hover:bg-accent/10 transition-colors"
                  >
                    <ImagePlus size={16} />
                    Anexar Arte / Imagem
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Attached image preview */}
                {attachedImage && (
                  <motion.div
                    className="relative rounded-xl overflow-hidden border border-accent/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img src={attachedImage} alt="Preview" className="w-full max-h-48 object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => setPreviewImage(true)}
                        className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center"
                      >
                        <Eye size={12} className="text-white" />
                      </button>
                      <button
                        onClick={() => setAttachedImage(null)}
                        className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  onClick={handleComplete}
                  disabled={!response.trim() && !attachedImage}
                  className="w-full py-3.5 rounded-full gradient-accent text-accent-foreground font-display font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
                  whileTap={{ scale: 0.97 }}
                >
                  <Send size={16} /> Concluir Desafio
                </motion.button>
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
              className="bg-card rounded-2xl border border-accent/30 p-4 mb-4 inline-block"
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

      {/* Full Image Preview Modal */}
      <AnimatePresence>
        {previewImage && attachedImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(false)}
          >
            <img src={attachedImage} alt="Preview" className="max-w-full max-h-full rounded-xl" />
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <X size={20} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
