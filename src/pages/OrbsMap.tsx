import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Lock, Map, Sparkles } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { XPBar } from '@/components/XPBar';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { ORB_ART, CHARACTER_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';

const ORB_THEME = {
  blue: { glow: 'shadow-[0_0_35px_hsl(var(--orb-blue)/0.35)]', border: 'border-orb-blue/50', text: 'text-orb-blue', wash: 'from-orb-blue/25' },
  green: { glow: 'shadow-[0_0_35px_hsl(var(--orb-green)/0.35)]', border: 'border-orb-green/50', text: 'text-orb-green', wash: 'from-orb-green/25' },
  purple: { glow: 'shadow-[0_0_35px_hsl(var(--orb-purple)/0.35)]', border: 'border-orb-purple/50', text: 'text-orb-purple', wash: 'from-orb-purple/25' },
  red: { glow: 'shadow-[0_0_35px_hsl(var(--orb-red)/0.35)]', border: 'border-orb-red/50', text: 'text-orb-red', wash: 'from-orb-red/25' },
  yellow: { glow: 'shadow-[0_0_35px_hsl(var(--orb-yellow)/0.35)]', border: 'border-orb-yellow/50', text: 'text-orb-yellow', wash: 'from-orb-yellow/25' },
} as const;

export default function OrbsMap() {
  const navigate = useNavigate();
  const { state, getOrbProgress, isOrbUnlocked } = useGame();

  if (!state.character) {
    navigate('/');
    return null;
  }

  const resume = getJourneyResume(state);

  return (
    <div className="min-h-screen overflow-hidden pb-24">
      <header className="relative border-b border-border bg-card/80 px-4 pb-5 pt-6 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <div className="mb-1 flex items-center gap-2"><Map size={18} className="text-accent" /><h1 className="font-display text-xl text-accent">Mapa das Orbes</h1></div>
          <p className="mb-4 font-body text-xs text-muted-foreground">Percorra os cinco territórios da sua jornada interior</p>
          <XPBar />
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 py-8">
        <div className="pointer-events-none absolute bottom-20 left-1/2 top-16 w-px -translate-x-1/2 bg-gradient-to-b from-orb-blue via-orb-purple to-orb-yellow opacity-40" />
        <div className="space-y-8">
          {ORBS.map((orb, index) => {
            const unlocked = isOrbUnlocked(index);
            const progress = getOrbProgress(index);
            const theme = ORB_THEME[orb.id];
            const challenges = getChallengesForOrb(orb.id);
            const completed = challenges.filter(challenge => state.challengeProgress[challenge.id]?.completed).length;
            const current = resume.orb.id === orb.id;
            const complete = progress === 100;

            return (
              <motion.article
                key={orb.id}
                className={`relative flex ${index % 2 ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: unlocked ? 1 : 0.42, y: 0 }}
                transition={{ delay: index * 0.09 }}
              >
                <Button
                  variant="ghost"
                  disabled={!unlocked}
                  onClick={() => navigate(`/orb/${orb.id}`)}
                  className={`group relative h-auto w-[92%] max-w-xl justify-start overflow-hidden whitespace-normal rounded-2xl border p-0 text-left ${theme.border} ${theme.glow} ${!unlocked ? 'grayscale' : ''}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.wash} via-card to-background`} />
                  <Sparkles className={`absolute right-4 top-4 ${theme.text} opacity-30`} />
                  <div className="relative z-10 flex w-full items-center gap-3 p-4 sm:gap-5 sm:p-5">
                    <div className="relative shrink-0">
                      <motion.img
                        src={ORB_ART[orb.id]}
                        alt={`Arte da ${orb.name}`}
                        className="h-24 w-24 object-contain drop-shadow-2xl sm:h-32 sm:w-32"
                        animate={current ? { y: [0, -6, 0] } : {}}
                        transition={{ duration: 2.8, repeat: Infinity }}
                      />
                      <div className={`absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border bg-background ${theme.border}`}>
                        {complete ? <Check size={14} className={theme.text} /> : unlocked ? <span className={`font-display text-[10px] ${theme.text}`}>{index + 1}</span> : <Lock size={12} />}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`font-body text-[9px] font-bold uppercase tracking-wider ${theme.text}`}>Fragmento {index + 1}</span>
                        {current && <span className="rounded-full bg-accent/15 px-2 py-0.5 font-body text-[8px] text-accent">Você está aqui</span>}
                      </div>
                      <h2 className="font-display text-sm text-foreground sm:text-base">{orb.name}</h2>
                      <p className={`mt-0.5 font-body text-xs ${theme.text}`}>{orb.theme}</p>
                      <p className="mt-2 line-clamp-2 font-body text-[10px] text-muted-foreground">{orb.focus} · Desenvolve {orb.develops}</p>
                      {unlocked && <div className="mt-3"><div className="mb-1 flex justify-between font-body text-[9px] text-muted-foreground"><span>{completed}/{challenges.length} desafios</span><span className={theme.text}>{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-secondary"><motion.div className={`h-full bg-orb-${orb.id}`} initial={{ width: 0 }} animate={{ width: `${progress}%` }} /></div></div>}
                    </div>
                    {unlocked && <ChevronRight className={`shrink-0 ${theme.text}`} />}
                  </div>
                </Button>
              </motion.article>
            );
          })}
        </div>
        <img src={CHARACTER_ART.mage} alt="Personagem explorando o mapa" className="pointer-events-none mx-auto -mb-8 mt-5 h-48 w-48 object-contain drop-shadow-2xl" />
      </main>
      <BottomNav />
    </div>
  );
}