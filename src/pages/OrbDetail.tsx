import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, CheckCircle, BookOpen, Sparkles, ImageIcon, FileText } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getChallengesForOrb, ORBS, getOrbStory } from '@/data/gameData';
import { OrbId } from '@/types/game';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';

const ORB_GRADIENTS: Record<string, string> = {
  blue: 'from-blue-500/20 via-blue-400/10 to-transparent',
  green: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
  purple: 'from-purple-500/20 via-purple-400/10 to-transparent',
  red: 'from-red-500/20 via-rose-400/10 to-transparent',
  yellow: 'from-amber-400/20 via-amber-300/10 to-transparent',
};

const ORB_ACCENT: Record<string, string> = {
  blue: 'text-blue-400',
  green: 'text-emerald-400',
  purple: 'text-purple-400',
  red: 'text-red-400',
  yellow: 'text-amber-400',
};

const ORB_BORDER: Record<string, string> = {
  blue: 'border-blue-400/30',
  green: 'border-emerald-400/30',
  purple: 'border-purple-400/30',
  red: 'border-red-400/30',
  yellow: 'border-amber-400/30',
};

const ORB_BG: Record<string, string> = {
  blue: 'bg-blue-400/10',
  green: 'bg-emerald-400/10',
  purple: 'bg-purple-400/10',
  red: 'bg-red-400/10',
  yellow: 'bg-amber-400/10',
};

export default function OrbDetail() {
  const { orbId } = useParams<{ orbId: string }>();
  const navigate = useNavigate();
  const { isChallengeUnlocked, isChallengeCompleted, getOrbProgress, state } = useGame();
  const [showStory, setShowStory] = useState(false);

  const orb = ORBS.find(o => o.id === orbId);
  if (!orb) return null;

  const challenges = getChallengesForOrb(orbId as OrbId);
  const progress = getOrbProgress(ORBS.indexOf(orb));
  const story = getOrbStory(orbId as OrbId);
  const gradient = ORB_GRADIENTS[orb.id] || '';
  const accent = ORB_ACCENT[orb.id] || 'text-accent';
  const border = ORB_BORDER[orb.id] || 'border-accent/30';
  const bg = ORB_BG[orb.id] || 'bg-accent/10';

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      <button onClick={() => navigate('/orbs')} className="flex items-center gap-1 text-muted-foreground font-body text-sm mb-4">
        <ChevronLeft size={16} /> Voltar
      </button>

      {/* Orb Header */}
      <div className={`relative rounded-2xl overflow-hidden border ${border} mb-5`}>
        <div className={`h-20 bg-gradient-to-br ${gradient} relative`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
        </div>
        <div className="relative -mt-6 px-4 pb-4 bg-card">
          <div className="flex items-end gap-3 mb-3">
            <motion.div
              className={`w-14 h-14 rounded-2xl ${bg} border ${border} flex items-center justify-center shadow-lg`}
              animate={{ boxShadow: ['0 0 10px rgba(255,255,255,0.05)', '0 0 20px rgba(255,255,255,0.1)', '0 0 10px rgba(255,255,255,0.05)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">🔮</span>
            </motion.div>
            <div className="flex-1 min-w-0 pt-7">
              <h1 className={`text-xl font-display ${accent}`}>{orb.name}</h1>
              <p className="text-[10px] text-muted-foreground font-body">{orb.theme} — {orb.focus}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-body text-muted-foreground">Progresso</span>
            <span className={`text-[10px] font-body font-semibold ${accent}`}>{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${ORB_GRADIENTS[orb.id]?.replace('/20', '/80').replace('/10', '/60') || 'gradient-accent'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-body text-muted-foreground">
              {challenges.filter(c => isChallengeCompleted(c.id)).length}/{challenges.length} desafios
            </span>
            <span className="text-[10px] font-body text-muted-foreground">
              Desenvolve: {orb.develops}
            </span>
          </div>
        </div>
      </div>

      {/* Story toggle */}
      {story && (
        <motion.button
          onClick={() => setShowStory(!showStory)}
          className={`w-full text-left p-4 rounded-2xl border ${border} ${bg} mb-4 flex items-center gap-3`}
          whileTap={{ scale: 0.98 }}
        >
          <BookOpen size={20} className={accent} />
          <div className="flex-1">
            <h3 className={`font-display text-sm ${accent}`}>{story.fragmentTitle}</h3>
            <p className="text-[10px] text-muted-foreground font-body">{showStory ? 'Toque para ocultar' : 'Toque para ler a história'}</p>
          </div>
        </motion.button>
      )}

      {showStory && story && (
        <motion.div
          className="bg-card rounded-2xl border border-border p-4 mb-4 space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <p className="text-sm font-body text-foreground/90 leading-relaxed whitespace-pre-line">{story.story}</p>
          <div>
            <h4 className={`text-[10px] font-display ${accent} uppercase tracking-wider mb-2`}>O que você vai aprender</h4>
            <ul className="space-y-1">
              {story.learningObjectives.map((obj, i) => (
                <li key={i} className="text-xs font-body text-muted-foreground flex gap-2">
                  <span className={accent}>•</span> {obj}
                </li>
              ))}
            </ul>
          </div>
          {progress === 100 && (
            <div className="border-t border-border pt-4 space-y-3">
              <div className={`${bg} rounded-xl p-3`}>
                <h4 className={`text-[10px] font-display ${accent} uppercase tracking-wider mb-1`}>Ponto de Reflexão</h4>
                <p className="text-sm font-body text-foreground/80 italic">"{story.reflectionPoint}"</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3">
                <h4 className={`text-[10px] font-display ${accent} uppercase tracking-wider mb-1`}>Habilidade Despertada</h4>
                <p className="text-sm font-body">{story.completionSkill.icon} {story.completionSkill.name}</p>
                <p className="text-xs text-muted-foreground font-body">{story.completionSkill.description}</p>
              </div>
              <p className="text-sm font-body text-foreground/80 leading-relaxed">{story.trajectoryStory}</p>
              <p className="text-sm font-body text-foreground/70 italic">"{story.finalReflection}"</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Challenge List */}
      <h2 className={`font-display text-sm ${accent} mb-3`}>Desafios</h2>
      <div className="space-y-3">
        {challenges.map((ch, i) => {
          const unlocked = isChallengeUnlocked(ch.id);
          const completed = isChallengeCompleted(ch.id);
          const prog = state.challengeProgress[ch.id];
          const hasImage = !!prog?.imageUrl;
          const hasText = !!prog?.response;

          return (
            <motion.button
              key={ch.id}
              onClick={() => unlocked && navigate(`/challenge/${ch.id}`)}
              disabled={!unlocked}
              className={`w-full text-left rounded-2xl border overflow-hidden transition-all ${
                completed
                  ? `${border} bg-card`
                  : unlocked
                    ? 'border-border bg-card hover:border-accent/40'
                    : 'border-border/40 bg-card/30 opacity-40'
              }`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={unlocked ? { scale: 0.98 } : {}}
            >
              {/* Challenge card header */}
              <div className={`px-4 py-3 flex items-center gap-3 ${completed ? `bg-gradient-to-r ${gradient}` : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold shrink-0 ${
                  completed ? `${bg} ${accent}` : unlocked ? 'bg-primary/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {completed ? <CheckCircle size={18} /> : unlocked ? i + 1 : <Lock size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm text-foreground">{ch.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-body text-muted-foreground">+{ch.xpReward} XP</span>
                    {ch.cardReward && (
                      <span className="text-[10px] font-body text-accent">{ch.cardReward.icon} Carta</span>
                    )}
                  </div>
                </div>
                {completed && (
                  <div className="flex items-center gap-1 shrink-0">
                    {hasImage && <ImageIcon size={12} className={accent} />}
                    {hasText && <FileText size={12} className={accent} />}
                  </div>
                )}
              </div>

              {/* Mini portfolio preview for completed */}
              {completed && (hasImage || hasText) && (
                <div className="px-4 pb-3 pt-0">
                  <div className="flex gap-2 items-start">
                    {hasImage && prog?.imageUrl && (
                      <img
                        src={prog.imageUrl}
                        alt="Arte"
                        className="w-16 h-16 rounded-lg object-cover border border-border shrink-0"
                      />
                    )}
                    {hasText && prog?.response && (
                      <p className="text-[10px] font-body text-muted-foreground line-clamp-3 flex-1">
                        {prog.response}
                      </p>
                    )}
                  </div>
                  {prog?.completedAt && (
                    <p className="text-[9px] font-body text-muted-foreground/60 mt-1.5">
                      ✅ {new Date(prog.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              )}

              {/* Description for unlocked but not completed */}
              {unlocked && !completed && (
                <div className="px-4 pb-3">
                  <p className="text-[10px] font-body text-muted-foreground line-clamp-2">{ch.objective}</p>
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
